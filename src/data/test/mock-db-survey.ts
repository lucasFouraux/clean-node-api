import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test/mock-survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'

// export const mockAddSurveyRepository = (): AddSurveyRepository => {
//   class AddSurveyRepositoryStub implements AddSurveyRepository {
//     async add (surveyData: AddSurveyParams): Promise<void> {
//       return await Promise.resolve()
//     }
//   }
//   return new AddSurveyRepositoryStub()
// }

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
    return await Promise.resolve()
  }
}

// export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
//   class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
//     async loadById (id: string): Promise<SurveyModel> {
//       return await Promise.resolve(mockSurveyModel())
//     }
//   }
//   return new LoadSurveyByIdRepositoryStub()
// }

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return await Promise.resolve(this.surveyModel)
  }
}

// export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
//   class LoadSurveysRepositoryStub implements LoadSurveysRepository {
//     async loadAll (): Promise<SurveyModel[]> {
//       return await Promise.resolve(mockSurveyModels())
//     }
//   }
//   return new LoadSurveysRepositoryStub()
// }

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels()
  callsCount = 0

  async loadAll (): Promise<SurveyModel[]> {
    this.callsCount++
    return await Promise.resolve(this.surveyModels)
  }
}
