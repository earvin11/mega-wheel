import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateChipMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const chipSchema = schema.create({
      value: schema.number(),
      primaryColor: schema.string(),
      secondaryColor: schema.string(),
      currency: schema.string(),
      operator: schema.string()
    })

    try {
      await request.validate({
        schema: chipSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
