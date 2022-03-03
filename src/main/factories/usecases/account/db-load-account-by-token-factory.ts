import env from '@/main/config/env'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { DbLoadAccountByToken } from '@/data/usecases'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
