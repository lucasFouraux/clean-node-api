import { MissingParamError } from '@/presentation/errors'
import { LoginController } from '@/presentation/controllers'
import faker from 'faker'
import { AuthenticationSpy, ValidationSpy } from '../mocks'
import { unauthorized, serverError, ok, badRequest } from '@/presentation/helpers'

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy

}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(validationSpy, authenticationSpy)

  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('Login Controller', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.authenticationModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValue(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    console.log(httpResponse)
    console.log('***')
    console.log(ok(authenticationSpy.authenticationModel))
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
