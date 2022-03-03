import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbLoadSurveybyId = (): LoadSurveyById => {
  const surveysMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveysMongoRepository)
}
