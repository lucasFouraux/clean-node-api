import { LoadSurveysController } from '@/presentation/controllers'
import MockDate from 'mockdate'
import faker from 'faker'
import { LoadSurveysSpy } from '../mocks'
import { noContent, ok, serverError } from '@/presentation/helpers'

const mockRequest = (): LoadSurveysController.Request => ({ accountId: faker.datatype.uuid() })

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.accountId).toBe(request.accountId)
  })

  it('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const HttpResponse = await sut.handle(mockRequest())
    expect(HttpResponse).toEqual(ok(loadSurveysSpy.surveyModels))
  })

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveyModels = []
    const HttpResponse = await sut.handle(mockRequest())
    expect(HttpResponse).toEqual(noContent())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockReturnValue(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
