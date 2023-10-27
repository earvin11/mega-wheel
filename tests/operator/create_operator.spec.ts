import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { OperatorEntity } from 'App/Operator/domain/entities/operator.entity'
import { Operator } from 'App/Operator/domain/implementations/operator.value'
import OperatorModel from 'App/Operator/infrastructure/operator.model'
import { ClientEntity } from 'App/Client/domain/client.entity'
import { Client } from 'App/Client/domain/client.value'
import ClientModel from 'App/Client/infrastructure/client.model'

test.group('Operator: Create operator.', (group) => {
  const operator: OperatorEntity = {
    casinoToken: 'USD',
    client: 'david',
    endpointAuth: 'http://localhost:3333/auth/login',
    endpointBet: 'http://localhost:3333/bet/create',
    endpointRollback: 'http://localhost:3333/bet/rollback',
    endpointWin: 'http://localhost:3333/bet/win',
    maxBet: 20000,
    minBet: 100,
    name: 'testOperator',
    operatorId: 12,
  }
  const newOperator = new Operator(operator)

  const client: ClientEntity = {
    endpointAuth: 'testClient',
    endpointBet: 'testClient',
    endpointRollback: 'testClient',
    endpointWin: 'testClient',
    name: 'testClient',
  }
  const newClient = new Client(client)

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
    await OperatorModel.create(newOperator)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await ClientModel.findOneAndDelete({ name: 'testClient' }).exec()
    await OperatorModel.findOneAndDelete({ name: 'testOperator' }).exec()
    await OperatorModel.findOneAndDelete({ name: 'testOperator2' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/operator/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/operator/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/operator/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: 'pepe' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Debe completar todos los campos requeridos!' })
  })

  test('Token and data ok: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/operator/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        casinoToken: 'USD',
        client: newClient.uuid,
        endpointAuth: 'http://localhost:3333/auth/login',
        endpointBet: 'http://localhost:3333/bet/create',
        endpointRollback: 'http://localhost:3333/bet/rollback',
        endpointWin: 'http://localhost:3333/bet/win',
        maxBet: 20000,
        minBet: 100,
        name: 'testOperator2',
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Operador creado!' })
  })
})
