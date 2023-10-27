import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('Authentication: Get User By Token', (group) => {
  group.setup(async () => {
    const userRegister: UserRegisterEntity = {
      name: 'pepe',
      lastName: 'pepe',
      userName: 'pepe',
      email: 'pepe',
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
    const response = await client.get('/auth/user')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proporcionar un token válido de acceso!' })
  })

  test('Not valid authentication user token: Should return a 401 status code and an success message', async ({
    client,
  }) => {
    const response = await client
      .get('/auth/user')
      .header('authentication-user-token', 'not valid token')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token mal formado!' })
  })

  test('Token Ok: Should return a 200 status code and an success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'pepe', password: 'pepe' })
    const { authenticationToken } = user.body()

    const response = await client
      .get('/auth/user')
      .header('authentication-user-token', authenticationToken)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Usuario encontrado!' })
  })
})
