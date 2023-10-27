import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { ClientEntity } from '../../app/Client/domain/client.entity'
import ClientModel from '../../app/Client/infrastructure/client.model'
import { Client } from '../../app/Client/domain/client.value'

test.group('Client: Add currency to client.', (group) => {
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
    const response = await client.put('/client/add-currency/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .put('/client/add-currency/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not currency provided: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/client/add-currency/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe enviar la moneda!' })
  })

  test('client uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/client/add-currency/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ currency: 'asdasd' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el cliente!' })
  })

  test('Token, client uuid and currency ok: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put(`/client/add-currency/${newClient.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ currency: 'btc' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Nueva moneda agregada al cliente!' })
  })

  test('currency already exist in the client: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    await client
      .put(`/client/add-currency/${newClient.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ currency: 'btc' })

    const response = await client
      .put(`/client/add-currency/${newClient.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ currency: 'btc' })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'La moneda ya fue agregado el cliente!' })
  })
})
