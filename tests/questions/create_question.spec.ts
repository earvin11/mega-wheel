import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { QuestionEntity } from 'App/questions/domain/question.entity'
import { Question } from 'App/questions/domain/question.value'
import QuestionModel from 'App/questions/infratructure/question.model'

test.group('Question.create', (group) => {
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
    const q: QuestionEntity = {
      question: 'Where are you from',
      userId: user.uuid,
    }
    const newQ = new Question(q)
    await QuestionModel.create(newQ)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await QuestionModel.findOneAndDelete({ question: 'Where are you from' }).exec()
    await QuestionModel.findOneAndDelete({ question: 'Who are you' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/question/create')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/question/create').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not complete data provider: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/question/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ question: '' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'You must complete all required fields!' })
  })

  test('User not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .post('/question/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ question: 'Who are you', userId: '44444444assss' })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'User not found!' })
  })

  test('Token and data ok: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const toUser = await UserModel.findOne({ name: 'user' }).exec()
    const response = await client
      .post('/question/create')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({
        question: 'Who are you',
        userId: toUser?.uuid,
      })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Question created!' })
  })
})
