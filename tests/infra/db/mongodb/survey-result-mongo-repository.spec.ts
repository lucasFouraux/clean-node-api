
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'
import { mockAddAccountParams } from '@/../tests/domain/mocks'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel | null> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image_1',
      answer: 'any_answer_1'
    }, {
      image: 'any_image_2',
      answer: 'any_answer_2'
    }, {
      answer: 'any_answer_3'
    }],
    date: new Date()
  })

  const surveyMongoRepository = new SurveyMongoRepository()
  const teste = res.insertedId.toHexString()
  const survey = await surveyMongoRepository.loadById(teste)
  return survey
}

const mockAccountId = async (): Promise<string | null> => {
  const accounData = mockAddAccountParams()
  const res = await accountCollection.insertOne(accounData)
  return res.insertedId.toHexString()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      const sut = makeSut()
      await sut.save({
        surveyId: survey?.id as string,
        accountId: accountId as string,
        answer: survey?.answers[0].answer as string,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(survey?.id as string),
        accountId: new ObjectId(accountId as string)
      }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })

    it('should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey?.id as string),
        accountId: new ObjectId(accountId as string),
        answer: survey?.answers[0].answer as string,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        surveyId: survey?.id as string,
        accountId: accountId as string,
        answer: survey?.answers[1].answer as string,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: survey?.id as string,
        accountId: accountId as string
      }).toArray()
      expect(surveyResult).toBeTruthy()
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load survey result', async () => {
      const survey = await makeSurvey()
      const accountId1 = await mockAccountId()
      const accountId2 = await mockAccountId()
      const sut = makeSut()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId1 as string),
        answer: survey?.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId2 as string),
        answer: survey?.answers[0].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey?.id as string, accountId1 as string)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(100)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(0)
      expect(surveyResult?.answers[1].percent).toBe(0)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('should load survey result 2', async () => {
      const survey = await makeSurvey()
      const accountId1 = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      const sut = makeSut()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId1 as string),
        answer: survey?.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId2 as string),
        answer: survey?.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId3 as string),
        answer: survey?.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey?.id as string, accountId2 as string)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(67)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(33)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('should load survey result 3', async () => {
      const survey = await makeSurvey()
      const accountId1 = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      const sut = makeSut()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId1 as string),
        answer: survey?.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(accountId2 as string),
        answer: survey?.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey?.id as string, accountId3 as string)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('should return null if there is no survey result', async () => {
      const survey = await makeSurvey()
      const sut = makeSut()
      const accountId = await mockAccountId()
      const surveyResult = await sut.loadBySurveyId(survey?.id as string, accountId as string)
      expect(surveyResult).toBeNull()
    })
  })
})
