import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '../usecases/authentication'
import faker from 'faker'
import { AddAccount } from '../usecases'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAddAccountWithTokenParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), {
  id: faker.datatype.uuid()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
