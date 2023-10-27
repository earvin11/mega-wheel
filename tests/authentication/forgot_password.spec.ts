import { test } from '@japa/runner'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'
import { UserRegister } from 'App/Authentication/domain/register.value'
import UserModel from 'App/User/infrastructure/user.model'

test.group('Authentication: Forgot Password', (group) => {
  const userRegister: UserRegisterEntity = {
    name: 'pepe',
    lastName: 'pepe',
    userName: 'pepe',
    email: 'd3vqba@gmail.com',
    password: 'pepe',
    client: 'pepe',
    rol: 'pepe',
    status: true
  }
  const userRegister2: UserRegisterEntity = {
    name: 'pepe2',
    lastName: 'pepe2',
    userName: 'pepe2',
    email: 'pepe2',
    password: 'pepe2',
    client: 'pepe2',
    rol: 'pepe2',
    status: true
  }

  const user = new UserRegister(userRegister)
  const user2 = new UserRegister(userRegister2)

  group.setup(async () => {
    await UserModel.create(user)
    await UserModel.create(user2)
  })

  group.teardown(async () => {
    await UserModel.findOneAndDelete({ name: 'pepe' }).exec()
    await UserModel.findOneAndDelete({ name: 'pepe2' }).exec()
  })

  test('No email provider: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auth/forgot-password')

    response.assertStatus(404)
    response.assertBodyContains({ error: 'No se encuentra el usuario!' })
  })

  test('Email not found: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auth/forgot-password').form({ email: 'pepe' })

    response.assertStatus(404)
    response.assertBodyContains({
      error: 'No se encuentra el usuario!',
    })
  })

  test('Not valid user email: Should return a 404 status code and an error message', async ({
    client,
  }) => {
    const response = await client.post('/auth/forgot-password').form({ email: 'pepe2' })

    response.assertStatus(404)
    response.assertBodyContains({
      error: 'No se pudo enviar el email para recuparar su contraseña. Email no válido!',
    })
  })

  test('Email Ok: Should return a 200 status code and an success message', async ({ client }) => {
    const response = await client.post('/auth/forgot-password').form({ email: 'd3vqba@gmail.com' })
    response.assertStatus(200)
    response.assertBodyContains({
      message:
        'Se ha enviado un mensaje a su correo con la información necesaria para restablecer la contraseña!',
    })
  })
})
