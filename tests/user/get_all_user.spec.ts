import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('User: Get all users', (group) => {
  group.setup(async () => {
    const userRegister: UserRegisterEntity = {
      name: 'user',
      lastName: 'user',
      userName: 'user',
      email: 'user',
      password: await Hash.make('user'),
      client: 'user',
      rol: 'user',
      status: true,
    }

    const user = new UserRegister(userRegister)
    await UserModel.create(user)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
  })

  test('Client not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/user/all').json({ clientId: 'asd' })

    response.assertStatus(404)
    response.assertBodyContains({
      error: 'No se encontraron usuarios con los parámetros especificados!',
    })
  })

  test('Client ok: Should return a 200 status code and an success message', async ({ client }) => {
    const response = await client.post('/user/all').json({ clientId: 'user' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Usuarios listados!' })
  })
})
