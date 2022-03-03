import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../protocols'

export class DbaddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result | null > {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    let newAccount: AccountModel | null = null
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return newAccount != null
  }
}
