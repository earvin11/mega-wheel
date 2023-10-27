import { test } from '@japa/runner'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserLoginEntity } from 'App/Authentication/domain/login.entity'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Authentication: Login', (group) => {
  group.setup(async () => {
    const userRegister: UserRegisterEntity = {
      name: 'userlogin',
      lastName: 'userlogin',
      userName: 'userlogin',
      email: 'userlogin',
      password: await Hash.make('userlogin'),
      client: 'userlogin',
      rol: 'userlogin',
      status: true,
    }

    const user = new UserRegister(userRegister)
    await UserModel.create(user)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'userlogin' }).exec()
  })

  test('User not found: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const badUserName: UserLoginEntity = {
      userName: 'badusername',
      password: 'userlogin',
    }

    const response = await client.post('/auth/login').form(badUserName)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Usuario o contraseña incorrectos!' })
  })

  test('Incorrect password: Should return a 401 status code and an error message', async ({
    client,
  }) => {
    const badUserPassword: UserLoginEntity = {
      userName: 'userlogin',
      password: 'asdasd',
    }
    const response = await client.post('/auth/login').form(badUserPassword)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Usuario o contraseña incorrectos!' })
  })

  test('User successfully authenticated: Should return a 201 status code and an success message', async ({
    client,
  }) => {
    const userLogin: UserLoginEntity = {
      userName: 'userlogin',
      password: 'userlogin',
    }

    const response = await client.post('/auth/login').form(userLogin)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Usuario autenticado!' })
  })
})
