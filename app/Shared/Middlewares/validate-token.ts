import Env from '@ioc:Adonis/Core/Env'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { authenticationUseCase } from 'App/Authentication/infrastructure/dependencies'
import { HttpContext } from '@adonisjs/core/build/standalone'

export default class ValidateToken {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { request, response } = ctx

    const token = request.header('authentication-x-token')
    if (!token)
      return response.status(401).json({ error: 'Debe proveer un token de autorización!' })

    try {
      const { userName:name } = <JwtPayload>jwt.verify(token, Env.get('APP_KEY'))

      const user = await authenticationUseCase.getUserbyUserName(name)

      if (!user) return response.status(404).json({ error: 'No se encuentra el usuario!' })
      if (!user.status) return response.status(401).json({ error: 'Usuario desactivado!' })

      const { uuid, userName, rol } = user

      ctx['user'] = {
        uuid,
        userName,
        rol,
      }

      await next()
    } catch (error) {
      console.log(error)
      return response.status(400).json({ error: 'Token inválido!' })
    }
  }
}
