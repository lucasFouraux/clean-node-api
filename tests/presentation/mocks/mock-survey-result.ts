import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { mockSurveyResultModel } from '../../domain/mocks'

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
  accountId: string

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResultModel)
  }
}
