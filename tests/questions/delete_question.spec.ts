import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { QuestionEntity } from 'App/questions/domain/question.entity'
import QuestionModel from 'App/questions/infratructure/question.model'
import { Question } from 'App/questions/domain/question.value'

test.group('Question.delete', (group) => {
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
      question: 'It is true',
      userId: user.uuid,
    }
    await QuestionModel.create(new Question(q))
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await QuestionModel.findOneAndDelete({ question: 'It is true' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.delete('/question/remove/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client
      .delete('/question/remove/asd')
      .header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('Not uuid provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .delete('/question/remove')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'E_ROUTE_NOT_FOUND: Cannot DELETE:/question/remove' })
  })

  test('Uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const response = await client
      .delete('/question/remove/123')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Question not found!' })
  })

  test('Token and uuid OK: Should return a 200 status code and an success message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })

    const question = await QuestionModel.findOne({ question: 'It is true' }).exec()
    if (!question) return
    const { uuid } = question

    const response = await client
      .delete(`/question/remove/${uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Question deleted!' })
  })
})
