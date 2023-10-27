import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Authentication: Get User By User Name', (group) => {
  const userRegister: UserRegisterEntity = {
    name: 'pepito',
    lastName: 'pepito',
    userName: 'pepito',
    email: 'pepito',
    password: 'pepito',
    client: 'pepito',
    rol: 'pepito',
    status: true,
  }

  const user = new UserRegister(userRegister)

  group.setup(async () => {
    await UserModel.create(user)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'pepito' }).exec()
  })

  test('User not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.get('/auth/user/pepe')

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el usuario!' })
  })

  test('User found: Should return a 200 status code and an success message', async ({ client }) => {
    const response = await client.get('/auth/user/pepito')

    response.assertStatus(200)
    response.assertBodyContains({ name: 'pepito' })
  })
})
