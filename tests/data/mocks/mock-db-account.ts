import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'
import faker from 'faker'
export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true
  addAccountParams: AddAccountRepository.Params

  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result: any | null = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  }

  email: string | null

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result | null> {
    this.email = email
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  result: any | null = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  token: string
  role?: string

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result | null> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.result)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    return await Promise.resolve()
  }
}
