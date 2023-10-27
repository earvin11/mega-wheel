import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Authentication: Register', (group) => {
  group.each.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'testrunner' }).exec()
  })

  const userTest: UserRegisterEntity = {
    name: 'testrunner',
    lastName: 'testrunner',
    userName: 'testrunner',
    email: 'testrunner',
    password: 'testrunner',
    client: 'testrunner',
    rol: 'testrunner',
    status: true
  }

  test('Not user provider: Should return a 400 status code and an error message', async ({ client }) => {
    const response = await client.post('/auth/register')

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Debe completar todos los campos requeridos!' })
  })

  test('User OK: Should return a 201 status code and an success message', async ({ client }) => {
    const user = new UserRegister(userTest)
    const response = await client.post('/auth/register').form(user)

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Usuario creado!' })
  })
})
