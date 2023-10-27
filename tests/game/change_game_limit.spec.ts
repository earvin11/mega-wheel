import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import UserModel from 'App/User/infrastructure/user.model'
import { GameEntity } from 'App/Game/domain/game.entity'
import { Game } from 'App/Game/domain/game.value'
import GameModel from 'App/Game/infrastructure/game.model'
import { OperatorEntity } from 'App/Operator/domain/entities/operator.entity'
import { Operator } from 'App/Operator/domain/implementations/operator.value'
import OperatorModel from 'App/Operator/infrastructure/operator.model'

test.group('Game: Change game limits!', (group) => {
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

  const game2: GameEntity = {
    maxBet: 1000,
    minBet: 50,
    name: 'testGame2',
    providerId: 'qwieuyqwei8768KJJasdas',
    operator: newOperator.uuid,
  }
  const newGame2 = new Game(game2)

  group.setup(async () => {
    const user: UserRegisterEntity = {
      name: 'user',
      lastName: 'user',
      userName: 'user',
      email: 'user',
      password: await Hash.make('user'),
      client: 'user',
      rol: 'user',
      status: true,
      uuid: newOperator.uuid,
    }

    await UserModel.create(user)
    await OperatorModel.create(newOperator)
    await GameModel.create(newGame)
    await GameModel.create(newGame2)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await GameModel.findOneAndDelete({ name: 'testGame' }).exec()
    await GameModel.findOneAndDelete({ name: 'testGame2' }).exec()
    await OperatorModel.findOneAndDelete({ name: 'testOperator' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/game/change-limits/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .put('/game/change-limits/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('not limits provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/change-limits/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Debe enviar los límites que desea actualizar!' })
  })

  test('game uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/change-limits/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ minBet: 20 })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el juego!' })
  })

  test('the game does not belong to the operator: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put(`/game/change-limits/${newGame.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ minBet: 20 })

    response.assertStatus(401)
    response.assertBodyContains({ error: 'El juego seleccionado no es de su propiedad!' })
  })

  test('request OK: Should return a 200 status code and an success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put(`/game/change-limits/${newGame2.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ minBet: 20 })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Límites del juego actualizados!' })
  })
})
