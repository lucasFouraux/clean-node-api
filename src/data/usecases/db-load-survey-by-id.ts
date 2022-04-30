import { LoadSurveyById } from '@/domain/usecases'
import { LoadSurveyByIdRepository } from '../protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<LoadSurveyById.Result | null> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
