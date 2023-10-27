import { test } from '@japa/runner'
import RoleModel from 'App/Rol/infrastructure/role.model'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Rol: create Rol', (group) => {
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
    await UserModel.findOneAndDelete({ email: 'user' }).exec()
    await RoleModel.findOneAndDelete({ name: 'Pincipal Javascript Engineer' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/role/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/role/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const login = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .post('/role/create')
      .header('authentication-x-token', login.body().authenticationToken)
      .json({})

    response.assertStatus(404)
    response.assertBodyContains({ error: 'El name es requerido!' })
  })

  test('Token and data ok: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const login = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .post('/role/create')
      .header('authentication-x-token', login.body().authenticationToken)
      .json({
        name: 'Pincipal Javascript Engineer',
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Rol creado!' })
  })
})
