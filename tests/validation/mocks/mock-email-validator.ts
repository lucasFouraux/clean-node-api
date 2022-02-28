import { EmailValidator } from '../protocols'

export class EmailValidatorSpy implements EmailValidator {
  isEmailValid: boolean = true
  email: string

  isValid (email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}
