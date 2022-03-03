import { DbaddAccount } from '@/data/usecases'
import { AddAccount } from '@/domain/usecases/add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbaddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
