import { HttpContext } from '@adonisjs/core/build/standalone'
import { RoleUseCase } from '../application/RoleUseCase'
import { RoleEntity } from '../domain/role.entity'
import { CreateAuditoryParams } from 'App/Shared/Interfaces/create-auditory.interface'
import CreateAuditory from 'App/Shared/Helpers/create-auditory'

export class RoleController {
  constructor(private roleUseCase: RoleUseCase) {}

  public createRole = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { name, status } = request.body()

    if (!name) return response.status(404).json({ error: 'El name es requerido!' })

    const role: RoleEntity = {
      name,
      status,
    }

    try {
      const roleCreated = await this.roleUseCase.createRole(role)
      const auditoryParams: CreateAuditoryParams = {
        action: 'Nuevo rol creado!',
        ctx,
        resource: name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(201).json({ message: 'Rol creado!', rol: roleCreated })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo crear el rol!', error })
    }
  }

  public getAllRoles = async ({ response }: HttpContext) => {
    try {
      const roles = await this.roleUseCase.getAllRoles()

      if (roles.length === 0)
        return response.status(404).json({ error: 'No se encontraron roles!' })

      return response.status(200).json({ message: 'Roles listados!', roles })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo realizar la consulta!', error })
    }
  }

  public deleteRole = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const role = await this.roleUseCase.deleteRole(uuid)
      if (!role) return response.status(404).json({ error: 'No existe el rol!' })

      return response.status(200).json({ message: 'Rol removido!', role })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo remover el Role!', error })
    }
  }
}
