import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import CurrencyModel from 'App/Currencies/infrastructure/currency.model'
import { CurrencyEntity } from 'App/Currencies/domain/currency.entity'
import { Currency } from 'App/Currencies/domain/currency.value'

test.group('Currency: Update currency.', (group) => {
  const currency: CurrencyEntity = {
    isoCode: 'AUD',
    name: 'Emiratos Árabes Dollar',
    usdRateChange: 0.66,
  }
  const newCurrency = new Currency(currency)

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
    await CurrencyModel.create(newCurrency)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await CurrencyModel.findOneAndDelete({ isoCode: 'AUD' }).exec()
    await CurrencyModel.findOneAndDelete({ isoCode: 'cad' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/currency/update/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .put('/currency/update/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('not data provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/currency/update/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(401)
    response.assertBodyContains({
      error: 'Debe enviar el isoCode o el name de la moneda que quiere actualizar!',
    })
  })

  test('isoCode not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/currency/update/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ isoCode: 'not found iso code' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Debe introducir un isoCode válido!' })
  })

  test('uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/currency/update/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ isoCode: 'cad' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra la moneda!' })
  })

  test('request OK: Should return a 200 status code and success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put(`/currency/update/${newCurrency.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ isoCode: 'cad' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Moneda actualizada!' })
  })
})
