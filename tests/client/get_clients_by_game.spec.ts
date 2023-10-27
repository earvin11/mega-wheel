import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { ClientEntity } from 'App/Client/domain/client.entity'
import ClientModel from 'App/Client/infrastructure/client.model'
import { Client } from 'App/Client/domain/client.value'
import { GameEntity } from 'App/Game/domain/game.entity'
import { Game } from 'App/Game/domain/game.value'
import GameModel from 'App/Game/infrastructure/game.model'

test.group('Client: Get clients by game.', (group) => {
  const clientEntity: ClientEntity = {
    endpointAuth: 'http://dota/auth',
    endpointBet: 'http://dota/bet',
    endpointRollback: 'http://dota/roll-back',
    endpointWin: 'http://dota/win',
    name: 'testClient',
  }
  const newClient = new Client(clientEntity)

  const game: GameEntity = {
    maxBet: 1000,
    minBet: 50,
    name: 'testGame',
    providerId: 'qwieuyqwei8768KJJ',
    operator: 'any operator',
  }
  const newGame = new Game(game)

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

    await GameModel.create(newGame)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await ClientModel.findOneAndDelete({ name: 'testClient' }).exec()
    await GameModel.findOneAndDelete({ name: 'testGame' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.get('/client/game/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.get('/client/game/asd').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('gameUuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .get('/client/game/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el juego!' })
  })

  test('the game does not exist in any client: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .get(`/client/game/${newGame.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No existen clientes asociados al juego!' })
  })

  test('Request Ok: Should return a 200 status code and an success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    await client
      .put(`/client/add-game/${newClient.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ gameUuid: newGame.uuid })

    const response = await client
      .get(`/client/game/${newGame.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Clientes listados!' })
  })
})
