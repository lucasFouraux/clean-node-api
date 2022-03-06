import faker from 'faker'
import { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  result = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result | null> {
    this.addAccountParams = account
    return await Promise.resolve(this.result)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  authenticationModel: Authentication.Result | null = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName()
  }

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result | null> {
    this.authenticationParams = authenticationParams
    return await Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result: any | null = { id: faker.datatype.uuid() }
  accessToken: string
  role?: string

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result | null> {
    this.accessToken = accessToken
    this.role = role ?? undefined
    return await Promise.resolve(this.result)
  }
}
