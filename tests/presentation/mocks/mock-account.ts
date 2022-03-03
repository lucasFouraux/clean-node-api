import { AccountModel } from '@/domain/models/account'
import faker from 'faker'
import { AuthenticationModel } from '@/domain/models/authentication'
import { AddAccount, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel } from '../../domain/mocks'

export class AddAccountSpy implements AddAccount {
  isValid = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result | null> {
    this.addAccountParams = account
    return await Promise.resolve(this.isValid)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel: AuthenticationModel | null = {
    accessToken: faker.datatype.uuid(),
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
