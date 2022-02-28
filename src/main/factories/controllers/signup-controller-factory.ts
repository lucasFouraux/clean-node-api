import { makeSignUpValidation } from './signup-validation-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import SignUpController from '@/presentation/controllers/signup-controller'
import { makeDbAddAccount, makeDbAuthentication } from '../usecases'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()))
}
