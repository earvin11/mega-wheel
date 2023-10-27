import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import Hash from '@ioc:Adonis/Core/Hash'
import ChipModel from 'App/Chip/infrastructure/chip.model'
import { CurrencyEntity } from 'App/Currencies/domain/currency.entity'
import { Currency } from 'App/Currencies/domain/currency.value'
import CurrencyModel from 'App/Currencies/infrastructure/currency.model'

test.group('Chip: Create chip.', (group) => {
  const currency: CurrencyEntity = {
    isoCode: 'CAD',
    name: 'Canadian dollar',
    usdRateChange: 0.8,
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
    await UserModel.findOneAndDelete({ email: 'user' }).exec()
    await ChipModel.findOneAndDelete({ currency: 'CAD' }).exec()
    await CurrencyModel.findOneAndDelete({ isoCode: 'CAD' }).exec()
  })

  test('Provide Token: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/chip/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Invalid Token: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/chip/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not valid data provided: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .post('/chip/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        currency: 'USD',
      })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Debe completar todos los campos requeridos!' })
  })

  test('Currency not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .post('/chip/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        value: 10,
        primaryColor: '#asd',
        secondaryColor: 'asdasd',
        currency: 'not found currency',
      })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra la moneda!' })
  })

  test('request OK: Should return a 201 status code and success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .post('/chip/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        value: 10,
        primaryColor: '#asd',
        secondaryColor: 'asdasd',
        currency: newCurrency.uuid,
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Ficha creada!' })
  })
})
