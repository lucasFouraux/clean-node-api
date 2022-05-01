import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyById } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbCheckSurveybyId = (): CheckSurveyById => {
  const surveysMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveysMongoRepository)
}
