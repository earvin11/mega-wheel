import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Authentication: Recover Password', (group) => {
  group.setup(async () => {
    const userRegister: UserRegisterEntity = {
      name: 'pepe',
      lastName: 'pepe',
      userName: 'pepe',
      email: 'd3vqba@gmail.com',
      password: await Hash.make('pepe'),
      client: 'pepe',
      rol: 'pepe',
      status: true,
    }

    const user = new UserRegister(userRegister)
    await UserModel.create(user)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'pepe' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auth/recover-password')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proporcionar un token válido de acceso!' })
  })

  test('Not new password provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .post('/auth/recover-password')
      .header('email-authentication-token', 'asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proporcionar la nueva contraseña!' })
  })

  test('Not valid token provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .post('/auth/recover-password')
      .header('email-authentication-token', 'asd')
      .form({ password: 'david' })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token mal formado!' })
  })

  test('Token and password OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const forgotPassword = await client
      .post('/auth/forgot-password')
      .json({ email: 'd3vqba@gmail.com' })

    const { forgotPasswordToken } = forgotPassword.body()

    const response = await client
      .post('/auth/recover-password')
      .header('email-authentication-token', forgotPasswordToken)
      .json({ password: 'test' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Contraseña actualizada!' })
  })
})
