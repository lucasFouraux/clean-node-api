import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveysMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveysMongoRepository)
}
