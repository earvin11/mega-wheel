import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'


export default class CreateFaqMiddleware {
  public handle = async (
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) => {
    const createFaqSchema = schema.create({
      question: schema.string(),
    })

    try {
      await request.validate({
        schema: createFaqSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'You must complete all required fields!', error})
    }
  }
}
