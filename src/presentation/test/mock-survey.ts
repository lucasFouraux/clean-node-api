import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/presentation/controllers/survey/add-survey/add-survey-controller-protocols'
import { LoadSurveys, SurveyModel } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveyModels())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(mockSurveyModel())
    }
  }

  return new LoadSurveyByIdStub()
}
