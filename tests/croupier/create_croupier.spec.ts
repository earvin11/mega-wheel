import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { CroupierEntity } from 'App/Croupiers/domain/croupier.entity'
import { Croupier } from 'App/Croupiers/domain/croupier.value'
import CroupierModel from 'App/Croupiers/infrastructure/croupier.model'

test.group('Croupier.create', (group) => {
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
    const croupier: CroupierEntity = {
      name: 'Croupier Nuevo',
    }
    const newCroupier = new Croupier(croupier)
    await CroupierModel.create(newCroupier)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await CroupierModel.findOneAndDelete({ name: 'Croupier Nuevo' }).exec()
    await CroupierModel.findOneAndDelete({ name: 'Croupier Final' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/croupier/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/croupier/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/croupier/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ name: '' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'You must complete all required fields!' })
  })

  test('Token and data ok: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/croupier/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        name: 'Croupier Final',
      })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Croupier created!' })
  })
})
