import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateUserMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const createUserSchema = schema.create({
      name: schema.string(),
      userName: schema.string(),
      lastName: schema.string(),
      email: schema.string(),
      password: schema.string(),
      client: schema.string(),
      rol: schema.string(),
      operator: schema.string(),
      tokenWallet: schema.string(),
    })

    try {
      await request.validate({
        schema: createUserSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!' })
    }
  }
}
