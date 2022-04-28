import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { Controller, HttpResponse } from '@/presentation/protocols'
import faker from 'faker'
import { ok, serverError } from '@/presentation/helpers'
import { LogErrorRepositorySpy } from '../../data/mocks'
class ControllerSpy implements Controller {
  httpResponse = ok(faker.random.uuid())
  request: any

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return await Promise.resolve(this.httpResponse)
  }
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = faker.random.words()
  return serverError(fakeError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = faker.lorem.sentence()
    await sut.handle(httpRequest)
    expect(controllerSpy.request).toEqual(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(faker.lorem.sentence())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    await sut.handle(faker.lorem.sentence())
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
