import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateGameMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const createGameSchema = schema.create({
      name: schema.string(),
      maxBet: schema.number(),
      minBet: schema.number(),
      providerId: schema.string(),
      operator: schema.string(),
    })

    try {
      await request.validate({
        schema: createGameSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
