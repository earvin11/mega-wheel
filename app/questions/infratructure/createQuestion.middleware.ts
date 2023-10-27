import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'


export default class CreateQuestionMiddleware {
  public handle = async (
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) => {
    const createQuestionSchema = schema.create({
      question: schema.string(),
      userId:schema.string(),
    })

    try {
      await request.validate({
        schema: createQuestionSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'You must complete all required fields!', error})
    }
  }
}
