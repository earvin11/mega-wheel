import { test } from '@japa/runner'
import SupportModel from '../../app/Support/infrastructure/support.model'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'
import { Support } from 'App/Support/domain/support.value'
import { OperatorEntity } from 'App/Operator/domain/entities/operator.entity'
import { Operator } from 'App/Operator/domain/implementations/operator.value'
import OperatorModel from '../../app/Operator/infrastructure/operator.model'

test.group('Support: Answer support ticket', (group) => {
  const ticket = {
    title: 'Test title',
    description: 'Some description',
    playerEmail: 'player@email.com',
  }
  const newSupportTicket = new Support(ticket)

  const operator: OperatorEntity = {
    casinoToken: 'USD',
    client: 'david',
    endpointAuth: 'http://localhost:3333/auth/login',
    endpointBet: 'http://localhost:3333/bet/create',
    endpointRollback: 'http://localhost:3333/bet/rollback',
    endpointWin: 'http://localhost:3333/bet/win',
    maxBet: 20000,
    minBet: 100,
    name: 'testOperator',
    operatorId: 12,
  }

  const newOperator = new Operator(operator)

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
    await OperatorModel.create(newOperator)
  })

  group.teardown(async () => {
    await SupportModel.findOneAndDelete({ title: 'Test title' }).exec()
    await UserModel.findOneAndDelete({ name: 'user' }).exec()
    await OperatorModel.findOneAndDelete({ name: 'testOperator' }).exec()
  })

  test('No token provider: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/support/answer/asd')

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Debe proveer un token de autorización!' })
  })

  test('Token not found: Should return a 400 status code and an error message', async ({
    client,
  }) => {
    const response = await client.put('/support/answer/asd').header('authentication-x-token', 'asd')

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Token inválido!' })
  })

  test('No data to answer provided: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/support/answer/asd')
      .header('authentication-x-token', user.body().authenticationToken)

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Debe enviar la respuesta y el operador!' })
  })

  test('ticket uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put('/support/answer/asd')
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ answer: 'test answer', operator: 'not found operator' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el ticket de soporte!' })
  })

  test('operator uuid not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put(`/support/answer/${newSupportTicket.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ answer: 'test answer', operator: 'not found operator' })

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el operador!' })
  })

  test('request OK: Should return a 200 status code and an success message', async ({ client }) => {
    const user = await client.post('/auth/login').json({ userName: 'user', password: 'user' })
    const response = await client
      .put(`/support/answer/${newSupportTicket.uuid}`)
      .header('authentication-x-token', user.body().authenticationToken)
      .json({ answer: 'test answer', operator: newOperator.uuid })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Respuesta actualizada!' })
  })
})
