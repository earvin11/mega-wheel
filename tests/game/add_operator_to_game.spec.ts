import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { GameEntity } from 'App/Game/domain/game.entity'
import { Game } from 'App/Game/domain/game.value'
import GameModel from 'App/Game/infrastructure/game.model'
import { OperatorEntity } from 'App/Operator/domain/entities/operator.entity'
import { Operator } from 'App/Operator/domain/implementations/operator.value'
import OperatorModel from 'App/Operator/infrastructure/operator.model'

test.group('Game: Add operator to game', (group) => {
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

    const game: GameEntity = {
      maxBet: 1000,
      minBet: 50,
      name: 'testGame',
      providerId: 'qwieuyqwei8768KJJ',
      operator: 'initial value',
    }
    const newGame = new Game(game)

    await UserModel.create(user)
    await OperatorModel.create(newOperator)
    await GameModel.create(newGame)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await GameModel.findOneAndDelete({ name: 'testGame' }).exec()
    await OperatorModel.findOneAndDelete({ name: 'testOperator' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/game/add-operator/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .put('/game/add-operator/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not uuid provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/add-operator')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'E_ROUTE_NOT_FOUND: Cannot PUT:/game/add-operator' })
  })

  test('Not operator uuid provided: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/add-operator/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe enviar el id del operador!' })
  })

  test('Operator uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/add-operator/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ operatorUuid: 'asdasd' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el operador!' })
  })

  test('Uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const operator = await OperatorModel.findOne({ name: 'testOperator' }).exec()
    if (!operator) return

    const response = await client
      .put('/game/add-operator/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ operatorUuid: operator.uuid })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el juego!' })
  })

  test('Token, uuid and operator uuid OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const game = await GameModel.findOne({ name: 'testGame' }).exec()
    if (!game) return

    const operator = await OperatorModel.findOne({ name: 'testOperator' }).exec()
    if (!operator) return

    const response = await client
      .put(`/game/add-operator/${game.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ operatorUuid: operator.uuid })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Operador agregado el juego!' })
  })

  test('operator is assigned: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const game = await GameModel.findOne({ name: 'testGame' }).exec()
    if (!game) return

    const operator = await OperatorModel.findOne({ name: 'testOperator' }).exec()
    if (!operator) return

    await client
      .put(`/game/add-operator/${game.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ operatorUuid: operator.uuid })

    const response = await client
      .put(`/game/add-operator/${game.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ operatorUuid: operator.uuid })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'El operador ya fue asignado a un juego!' })
  })
})
