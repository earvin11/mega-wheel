import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import GameModel from 'App/Game/infrastructure/game.model'
import { OperatorEntity } from 'App/Operator/domain/entities/operator.entity'
import { Operator } from 'App/Operator/domain/implementations/operator.value'
import OperatorModel from 'App/Operator/infrastructure/operator.model'

test.group('Game: Create game.', (group) => {
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
    await OperatorModel.create(newOperator)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await OperatorModel.findOneAndDelete({ name: 'testOperator' }).exec()
    await GameModel.findOneAndDelete({ name: 'testGame' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/game/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/game/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/game/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: 'pepe' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Debe completar todos los campos requeridos!' })
  })

  test('Operator not found: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/game/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        maxBet: 500,
        minBet: 20,
        name: 'testGame',
        providerId: 'adasdads98987KJHKJH',
        operator: 'asdasd',
      })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el operador!' })
  })

  test('Token and data ok: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/game/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        maxBet: 500,
        minBet: 20,
        name: 'testGame',
        providerId: 'adasdads98987KJHKJH',
        operator: newOperator.uuid,
      })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Juego creado!' })
  })
})
