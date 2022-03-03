import { DbaddAccount } from '@/data/usecases'
import { mockAccountModel, mockAddAccountParams } from '../../domain/mocks'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '../mocks'

type SutTypes = {
  sut: DbaddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbaddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    sut,
    addAccountRepositorySpy,
    hasherSpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return true if LoadAcccountByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(true)
  })

  it('should return null if LoadAcccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })
})
