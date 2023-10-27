import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class LoginMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const loggedUserSchema = schema.create({
      userName: schema.string(),
      password: schema.string(),
    })

    try {
      await request.validate({
        schema: loggedUserSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!' })
    }
  }
}
