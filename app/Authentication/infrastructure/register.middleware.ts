import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class RegisterMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const registeredUserSchema = schema.create({
      name: schema.string(),
      userName: schema.string(),
      lastName: schema.string(),
      email: schema.string(),
      password: schema.string(),
      client: schema.string(),
      rol: schema.string(),
    })

    try {
      await request.validate({
        schema: registeredUserSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!' })
    }
  }
}
