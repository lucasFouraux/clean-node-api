import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/db-load-survey-result-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveybyId } from '../usecases'

export const makeLoadSurveyResultController = (): Controller => {
  return new LoadSurveyResultController(makeDbLoadSurveybyId(), makeDbLoadSurveyResult())
}
