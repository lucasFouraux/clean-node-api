export type SurveyResultModel = {
  id: string
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
