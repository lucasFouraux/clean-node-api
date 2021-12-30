import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAuthentication } from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import {
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  Encrypter

} from './db-authentication-protocols'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = mockLoadAccountByEmailRepository()
  const hashCompareStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    loadAccountByEmailRepository,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    sut
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
    await sut.auth(mockAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should return undefined if LoadAccountByEmailRepository returns undefined', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBeUndefined()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(mockAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should return undefined if HashComparer returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBeUndefined()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should call return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBe('any_token')
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
