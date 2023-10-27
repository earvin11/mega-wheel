import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import CurrencyModel from '../../app/Currencies/infrastructure/currency.model'

test.group('Currency: Create currency.', (group) => {
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
    await CurrencyModel.findOneAndDelete({ isoCode: 'CAD' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/currency/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/currency/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/currency/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: 'pepe' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Debe completar todos los campos requeridos!' })
  })

  test('isoCode not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/currency/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ isoCode: 'not valid iso code', name: 'test name' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Debe introducir un isoCode válido!' })
  })

  test('isoCode and token auth OK: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/currency/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ isoCode: 'cad', name: 'DÓLAR CANADIENSE' })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Moneda creada!' })
  })
})
