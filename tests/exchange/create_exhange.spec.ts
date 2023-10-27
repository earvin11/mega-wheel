import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { ExchangeEntity } from 'App/ExchangeApi/domain/exchange.entity'
import { Exchange } from 'App/ExchangeApi/domain/exchange.value'
import ExchangeModel from 'App/ExchangeApi/infrastructure/exchange.model'

test.group('Exchange Api: Create exchange.', (group) => {
  const exchange: ExchangeEntity = {
    name: 'testExchange',
    url: 'http://test.exchange',
  }
  const newExchange = new Exchange(exchange)

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
    await ExchangeModel.findOneAndDelete({ name: 'testExchange' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/exchange/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/exchange/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/exchange/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: 'pepe' })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Debe enviar el nombre y la url del exchange!' })
  })

  test('Token and data ok: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/exchange/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        ...newExchange
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Exchange creado!' })
  })
})
