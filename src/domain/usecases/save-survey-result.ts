import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string | null
  date: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel | null>
}
