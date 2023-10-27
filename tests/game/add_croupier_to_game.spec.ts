import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { GameEntity } from '../../app/Game/domain/game.entity'
import { Game } from '../../app/Game/domain/game.value'
import GameModel from '../../app/Game/infrastructure/game.model'

test.group('Game: Add croupier to game', (group) => {
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
    await GameModel.create(newGame)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await GameModel.findOneAndDelete({ name: 'testGame' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/game/add-croupier/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .put('/game/add-croupier/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not uuid provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/add-croupier')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'E_ROUTE_NOT_FOUND: Cannot PUT:/game/add-croupier' })
  })

  test('Not croupier uuid provided: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/game/add-croupier/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe enviar el id del croupier!' })
  })

  test('Uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .put('/game/add-croupier/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ croupierUuid: 'pepe-pepe' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el juego!' })
  })

  test('Token, uuid and croupier uuid OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .put(`/game/add-croupier/${newGame.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ croupierUuid: 'pepe-pepe' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Croupier agregado el juego!' })
  })
})
