import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '../controllers/login/signup/signup-controller-protocols'
import { AccountModel } from '@/domain/models/account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'
import faker from 'faker'
import { AuthenticationModel } from '@/domain/models/authentication'

export class AddAccountSpy implements AddAccount {
  accountModel: AccountModel | null = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = account
    return await Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel: AuthenticationModel | null = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName()
  }

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel | null> {
    this.authenticationParams = authenticationParams
    return await Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel | null = mockAccountModel()
  accessToken: string
  role?: string

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    this.accessToken = accessToken
    this.role = role ?? undefined
    return await Promise.resolve(this.accountModel)
  }
}
