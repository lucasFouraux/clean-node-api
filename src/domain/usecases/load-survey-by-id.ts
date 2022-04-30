import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<LoadSurveyById.Result | null>
}

export namespace LoadSurveyById {
  export type Result = SurveyModel
}
