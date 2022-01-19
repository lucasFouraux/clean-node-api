
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyMongoRepository } from '../survey/survey-mongo-repository'
import { AccountModel } from '@/domain/models/account'
import { AccountMongoRepository } from '../account/account-mongo-repository'

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

const makeAccount = async (): Promise<AccountModel | null> => {
  await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const accountMongoRepository = new AccountMongoRepository()
  const account = await accountMongoRepository.loadByEmail('any_email@mail.com')
  return account
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
      const account = await makeAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey?.id as string,
        accountId: account?.id as string,
        answer: survey?.answers[0].answer as string,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(survey?.id as string),
        accountId: new ObjectId(account?.id as string)
      }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })

    it('should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey?.id as string),
        accountId: new ObjectId(account?.id as string),
        answer: survey?.answers[0].answer as string,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        surveyId: survey?.id as string,
        accountId: account?.id as string,
        answer: survey?.answers[1].answer as string,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: survey?.id as string,
        accountId: account?.id as string
      }).toArray()
      expect(surveyResult).toBeTruthy()
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(account?.id),
        answer: survey?.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(account?.id),
        answer: survey?.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(account?.id),
        answer: survey?.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey?.id),
        accountId: new ObjectId(account?.id),
        answer: survey?.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey?.id as string)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId.toString()).toBe(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[1].count).toBe(2)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[2].count).toBe(0)
      expect(surveyResult?.answers[2].percent).toBe(0)
    })
  })
})
