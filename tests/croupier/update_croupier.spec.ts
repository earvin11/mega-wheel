import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { CroupierEntity } from 'App/Croupiers/domain/croupier.entity'
import CroupierModel from 'App/Croupiers/infrastructure/croupier.model'
import { Croupier } from 'App/Croupiers/domain/croupier.value'

test.group('Croupier.update', (group) => {
  const croupier: CroupierEntity = {
    name: 'Orlando Contreras',
  }
  const newCroupier = new Croupier(croupier)

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
    await CroupierModel.create(newCroupier)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await CroupierModel.findOneAndDelete({ name: 'Orlando Contreras' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/croupier/update/123')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .put('/croupier/update/123')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not uuid provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/croupier/update')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'E_ROUTE_NOT_FOUND: Cannot PUT:/croupier/update' })
  })

  test('Uuid not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/croupier/update/123')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: 'Juan Luis Guerra' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Croupier not found!' })
  })

  test('Not data to update provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const uuid = newCroupier.uuid

    const response = await client
      .put(`/croupier/update/${uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({})

    response.assertStatus(400)
    response.assertBodyContains({ message: 'You must complete all required fields!' })
  })

  test('Token, uuid and data to update OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const uuid = newCroupier.uuid

    const response = await client
      .put(`/croupier/update/${uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: 'Tomas' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Croupier update!' })
  })
})
