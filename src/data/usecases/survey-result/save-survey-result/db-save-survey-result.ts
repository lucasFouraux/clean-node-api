import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultParams, SaveSurveyResult } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepositoty: SaveSurveyResultRepository) {}
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    const surveyResult = await this.saveSurveyResultRepositoty.save(data)
    return surveyResult
  }
}
