import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('should return an account on success CORS', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Lucas',
        email: 'lucasfouraux@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
