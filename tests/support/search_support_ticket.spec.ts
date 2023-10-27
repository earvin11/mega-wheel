import { test } from '@japa/runner'
import SupportModel from '../../app/Support/infrastructure/support.model'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { Support } from 'App/Support/domain/support.value'

test.group('Support: Search support tickets', (group) => {
  const ticket = {
    title: 'Test title',
    description: 'Some description',
    playerEmail: 'player@email.com',
  }
  const newSupportTicket = new Support(ticket)

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
    await SupportModel.create(newSupportTicket)
  })

  group.teardown(async () => {
    await SupportModel.findOneAndDelete({ title: 'Test title' }).exec()
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/support/search')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/support/search').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not page and limit provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/support/search')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Debe enviar limit y page!' })
  })

  test('Not result: Should return a 404 status code and an error message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/support/search')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ page: 1, limit: 5, playerEmail: 'not-exist@player.email' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encontraron resultados con los filtros enviados!' })
  })

  test('Search OK: Should return a 200 status code and an success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/support/search')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ page: 1, limit: 5 })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Tickets listados!' })
  })
})
