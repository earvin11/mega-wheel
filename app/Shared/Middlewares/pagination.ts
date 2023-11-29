import { HttpContext } from '@adonisjs/core/build/standalone'

export default class ValidatePagination {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { request, response } = ctx
    const { page, limit } = request.qs()

    try {

      if (!page) return response.badRequest({ message: 'page is necessary!' })
      if (!limit) return response.badRequest({ message: 'limit is necessary!' })

      await next()
    } catch (error) {
      console.log(error)
      return response.status(400).json({ error: 'Token inválido!' })
    }
  }
}
