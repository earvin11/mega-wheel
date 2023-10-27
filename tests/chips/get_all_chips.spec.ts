import { test } from '@japa/runner'
import ChipModel from 'App/Chip/infrastructure/chip.model'
import UserModel from 'App/User/infrastructure/user.model'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { ChipEntity } from 'App/Chip/domain/chip.entity'
import { Chip } from 'App/Chip/domain/chip.value'

test.group('Chip: Create chip.', (group) => {
  const chip: ChipEntity = {
    color: {
      primary: 'primary color',
      secondary: 'secondary color',
    },
    currency: 'CAD',
    value: 10,
    operator: '123'
  }
  const newChip = new Chip(chip)

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
    await ChipModel.create(newChip)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ email: 'user' }).exec()
    await ChipModel.findOneAndDelete({ currency: 'CAD' }).exec()
  })

  test('Provide Token: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.get('/chip/all')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Invalid Token: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.get('/chip/all').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('request OK: Should return a 200 status code and success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .get('/chip/all')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Fichas listadas!' })
  })
})
