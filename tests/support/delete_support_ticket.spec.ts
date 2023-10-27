import { test } from '@japa/runner'
import { SupportEntity } from '../../app/Support/domain/support.entity'
import SupportModel from '../../app/Support/infrastructure/support.model'
import { Support } from '../../app/Support/domain/support.value'
import { UserRegisterEntity } from '../../app/Authentication/domain/register.entity'
import { UserRegister } from '../../app/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('Support: Delete support ticket', (group) => {
  const ticket: SupportEntity = {
    title: 'Some title',
    description: 'Some description',
    playerEmail: 'player@email.com',
  }
  const newTicket = new Support(ticket)

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
    await SupportModel.create(newTicket)
  })

  group.teardown(async () => {
    await SupportModel.findOneAndDelete({ playerEmail: 'player@email.com' }).exec()
    await UserModel.findOneAndDelete({ userName: 'user' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.delete('/support/remove/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .delete('/support/remove/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Client uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .delete('/support/remove/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el ticket de soporte!' })
  })

  test('Token and client uuid OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .delete(`/support/remove/${newTicket.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Ticket eliminado!' })
  })
})
