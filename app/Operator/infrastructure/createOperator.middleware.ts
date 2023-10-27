import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateOperatorMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const createOperatorSchema = schema.create({
      casinoToken: schema.string(),
      client: schema.string(),
      endpointAuth: schema.string(),
      endpointBet: schema.string(),
      endpointRollback: schema.string(),
      endpointWin: schema.string(),
      maxBet: schema.number(),
      minBet: schema.number(),
      name: schema.string(),
    })

    try {
      await request.validate({
        schema: createOperatorSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
