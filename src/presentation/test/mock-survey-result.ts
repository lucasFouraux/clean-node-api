import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel: SurveyResultModel | null = mockSurveyResultModel()
  saveSurveyResultParams: SaveSurveyResultParams

  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    this.saveSurveyResultParams = saveSurveyResultParams
    return await Promise.resolve(this.surveyResultModel)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel = mockSurveyResultModel()
  surveyId: string

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    return await Promise.resolve(this.surveyResultModel)
  }
}
