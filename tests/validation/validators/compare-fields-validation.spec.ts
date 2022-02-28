import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields-validation'
import faker from 'faker'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareField Validation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: faker.random.word(),
      fieldToCompare: faker.random.word()
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSut()
    const value = faker.random.word()
    const error = sut.validate({
      field: value,
      fieldToCompare: value
    })
    expect(error).toBeFalsy()
  })
})
