import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveybyId, makeDbSaveSurveyResult } from '../usecases'

export const makeSaveSurveyResultController = (): Controller => {
  return new SaveSurveyResultController(makeDbLoadSurveybyId(), makeDbSaveSurveyResult())
}
