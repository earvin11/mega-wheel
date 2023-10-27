import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { ClientEntity } from 'App/Client/domain/client.entity'
import ClientModel from 'App/Client/infrastructure/client.model'
import { Client } from 'App/Client/domain/client.value'

test.group('Client: Disable client.', (group) => {
  const clientEntity: ClientEntity = {
    endpointAuth: 'http://dota/auth',
    endpointBet: 'http://dota/bet',
    endpointRollback: 'http://dota/roll-back',
    endpointWin: 'http://dota/win',
    name: 'testClient',
  }
  const newClient = new Client(clientEntity)

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

    await ClientModel.create(newClient)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await ClientModel.findOneAndDelete({ name: 'testClient' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/client/disable')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/client/disable').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not uuid provided: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/client/disable')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe enviar el uuid del cliente!' })
  })

  test('Uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/client/disable')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ uuid: 'asdasd' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el cliente!' })
  })

  test('Token and uuid ok: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/client/disable')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ uuid: newClient.uuid })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Cliente deshabilitado!' })
  })
})
