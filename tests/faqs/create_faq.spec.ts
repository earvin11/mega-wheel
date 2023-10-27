import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { FaqEntity } from 'App/Faqs/domain/faq.entity'
import { Faq } from 'App/Faqs/domain/faq.value'
import FaqModel from 'App/Faqs/infratructure/faq.model'

test.group('FAQ.create', (group) => {
  const faq: FaqEntity = {
    question: 'Where are you from',
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
    await FaqModel.findOneAndDelete({ question: 'Where are you from' }).exec()
    await FaqModel.findOneAndDelete({ question: 'Who are you' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/faq/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/faq/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/faq/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ question: '' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'You must complete all required fields!' })
  })

  test('Token and data ok: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/faq/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        question: 'Who are you',
      })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'FAQ created!' })
  })
})
