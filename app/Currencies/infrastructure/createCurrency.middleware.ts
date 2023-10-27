import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateCurrencyMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const createCurrencySchema = schema.create({
      isoCode: schema.string(),
      name: schema.string(),
    })

    try {
      await request.validate({
        schema: createCurrencySchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
