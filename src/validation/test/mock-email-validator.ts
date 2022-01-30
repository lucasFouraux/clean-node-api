import { EmailValidator } from '@/validation/validators/email-validator'

export class EmailValidatorSpy implements EmailValidator {
  isEmailValid: boolean = true
  email: string

  isValid (email: string): boolean {
    console.log('passou')
    console.log('Valor Email: ' + email)
    this.email = email
    return this.isEmailValid
  }
}
