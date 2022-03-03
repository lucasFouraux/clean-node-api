import { AddSurveyController } from '@/presentation/controllers'
import MockDate from 'mockdate'
import faker from 'faker'
import { AddSurveySpy, ValidationSpy } from '../mocks'
import { badRequest, serverError, noContent } from '@/presentation/helpers'

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }]
})

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addSurveySpy.addSurveyParams).toEqual({ ...request, date: new Date() })
  })

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const request = await sut.handle(mockRequest())
    expect(request).toEqual(serverError(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const request = await sut.handle(mockRequest())
    expect(request).toEqual(noContent())
  })
})
