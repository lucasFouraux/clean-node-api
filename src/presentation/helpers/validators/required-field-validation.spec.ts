import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ other_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
