import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateClientMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const clientSchema = schema.create({
      endpointAuth: schema.string(),
      endpointBet: schema.string(),
      endpointRollback: schema.string(),
      endpointWin: schema.string(),
      name: schema.string(),
    })

    try {
      await request.validate({
        schema: clientSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!' })
    }
  }
}
