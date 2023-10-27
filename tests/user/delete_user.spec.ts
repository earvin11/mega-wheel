import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('User: Delete user', (group) => {
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

  test('User uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.delete('/user/remove/asd')

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encontró el usuario!' })
  })

  test('User uuid OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await UserModel.findOne({ name: 'user' }).exec()
    if (!user) return
    const response = await client.delete(`/user/remove/${user.uuid}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Usuario eliminado correctamente!' })
  })
})
