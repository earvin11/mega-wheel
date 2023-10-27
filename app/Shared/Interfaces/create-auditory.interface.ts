import { HttpContext } from '@adonisjs/core/build/standalone'
import { UserRegisterEntity } from 'App/Authentication/domain/register.entity'

export interface CreateAuditoryParams {
  ctx: HttpContext
  resource?: string
  user?: UserRegisterEntity
  action: string
}
