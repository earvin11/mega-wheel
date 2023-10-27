import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateSupportTicketMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const createTicketSchema = schema.create({
      title: schema.string(),
      description: schema.string(),
      tokenAuth: schema.string(),
    })

    try {
      await request.validate({
        schema: createTicketSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
