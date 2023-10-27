import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { FaqEntity } from 'App/Faqs/domain/faq.entity'
import FaqModel from 'App/Faqs/infratructure/faq.model'
import { Faq } from 'App/Faqs/domain/faq.value'

test.group('FAQ.update', (group) => {
  const faq: FaqEntity = {
    question: 'It is true',
  }
  const newFaq = new Faq(faq)

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
    await FaqModel.create(newFaq)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await FaqModel.findOneAndDelete({ question: 'It is true' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/faq/update/123')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/faq/update/123').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not uuid provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/faq/update')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'E_ROUTE_NOT_FOUND: Cannot PUT:/faq/update' })
  })

  test('Uuid not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/faq/update/123')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ answer: 'Juan Luis Guerra' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'FAQ not found!' })
  })

  test('Not data to update provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const uuid = newFaq.uuid

    const response = await client
      .put(`/faq/update/${uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({})

    response.assertStatus(401)
    response.assertBodyContains({ error: 'You must send at least the answer!' })
  })

  test('Token, uuid and data to update OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const uuid = newFaq.uuid

    const response = await client
      .put(`/faq/update/${uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ answer: 'Oh yea' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'FAQ update!' })
  })
})
