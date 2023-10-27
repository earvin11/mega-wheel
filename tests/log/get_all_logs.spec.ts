import { test } from '@japa/runner'
import { LogEntity } from 'App/Log/domain/log.entity'
import { Log } from 'App/Log/domain/log.value'
import LogModel from '../../app/Log/infrastructure/log.model'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Log: Get all logs', (group) => {
  const log: LogEntity = {
    error: 'test error',
    ip: 'http://localhost:8080',
    player: 'test player',
    request: 'request test',
    response: 'response test',
  }

  const newLog = new Log(log)

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
    await LogModel.create(newLog)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ email: 'user' }).exec()
    await LogModel.findOneAndDelete({ error: 'test error' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/log/all')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/log/all').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Logs Found: Should return a 200 status code and an success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/log/all')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ page: 0, limit: 10 })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Logs listados!' })
  })

  test('Page or Limit values are required: Should return a 404 and error if Page and Limit value are undefined', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/log/all')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({})
    response.assertStatus(400)
    response.assertBodyContains({ error: 'Page y Limit son requeridos!' })
  })

  test('Not is a number page or limit data: Should return a 404 when no logs is found', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/log/all')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ page: 'not is a number', limit: 10 })

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Page y Limit deben ser datos numéricos!' })
  })
})
