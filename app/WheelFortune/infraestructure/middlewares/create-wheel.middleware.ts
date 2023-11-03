import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProductRequest {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const wheelSchema = schema.create({
      name: schema.string(),
      providerId: schema.string(),
      bettiem: schema.string()
    });
  
    try {
      await request.validate({
        schema: wheelSchema
      });
      await next();
    } catch (error) {
      response.badRequest(error.messages);
    }
  }
}