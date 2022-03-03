import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { SignUpController } from '@/presentation/controllers'
import faker from 'faker'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '../mocks'
import { forbidden, serverError, badRequest, ok } from '@/presentation/helpers'

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUpController', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  it('should return 500 if AddAccount throws ', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.isValid = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
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

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValue(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
