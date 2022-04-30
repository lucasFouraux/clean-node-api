import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise <SurveyModel | null>
}

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel
}
