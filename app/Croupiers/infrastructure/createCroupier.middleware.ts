import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'


export default class CreateCroupierMiddleware {
  public handle = async (
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) => {
    const createCroupierSchema = schema.create({
       name: schema.string(),
    })

    try {
      await request.validate({
        schema: createCroupierSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'You must complete all required fields!', error})
    }
  }
}
