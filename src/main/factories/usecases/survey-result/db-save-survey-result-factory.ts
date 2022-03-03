import { DbSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResult } from '@/domain/usecases/save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const saveSurveyResultMongoRepository = new SurveyResultMongoRepository()
  const loadSurveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(saveSurveyResultMongoRepository, loadSurveyResultMongoRepository)
}
