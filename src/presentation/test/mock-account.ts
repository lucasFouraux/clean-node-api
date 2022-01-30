import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '../controllers/login/signup/signup-controller-protocols'
import { AccountModel } from '@/domain/models/account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'
import faker from 'faker'

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
  token: string | null = faker.random.uuid()

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    this.authenticationParams = authenticationParams
    return await Promise.resolve(this.token)
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
