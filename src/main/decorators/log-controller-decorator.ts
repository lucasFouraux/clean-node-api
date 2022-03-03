import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) { }

  async handle (request: any): Promise <HttpResponse> {
    const httpResponse = await this.controller.handle(request)
    console.log('STATUS CODE: ')
    console.log(httpResponse.statusCode)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
