import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '../../domain/mocks'
import { SurveyResultModel } from '@/domain/models'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultParams

  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel: SurveyResultModel | null = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResultModel)
  }
}
