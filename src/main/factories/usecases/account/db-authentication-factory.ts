import env from '@/main/config/env'
import { Authentication } from '@/domain/usecases/authentication'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { DbAuthentication } from '@/data/usecases'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
