import { UserUseCase } from '../application/UserUseCase'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { SearchUserEntity } from '../domain/search.entity'
import { CreateAuditoryParams } from 'App/Shared/Interfaces/create-auditory.interface'
import CreateAuditory from 'App/Shared/Helpers/create-auditory'
import Hash from '@ioc:Adonis/Core/Hash'
import { UpdateUserEntity } from '../domain/updateUser.entity'
import { UserEntity } from '../domain/user.entity'
import { clientUseCases } from '../../Client/infrastructure/dependencies'
import { operatorUseCases } from '../../Operator/infrastructure/dependencies'

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  public getUserById = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()
    if (!uuid) return response.status(401).json({ error: 'Debe enviar el id del usuario!' })

    try {
      const user = await this.userUseCase.getUserById(uuid)
      if (!user) return response.status(404).json({ error: 'No se encuentra el usuario!' })

      return response.status(200).json({ message: 'Usuario encontrado!', user })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo obtener el usuario!' })
    }
  }

  public deleteUser = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()
    if (!uuid) return response.status(401).json({ error: 'Debe enviar el uuid del usuario!' })

    try {
      const user = await this.userUseCase.deleteUser(uuid)
      if (!user) return response.status(404).json({ error: 'No se encontró el usuario!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Eliminar usuario!',
        ctx,
        user,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Usuario eliminado correctamente!', user })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo eliminar el usuario!' })
    }
  }

  public getAllUsers = async ({ request, response }: HttpContext) => {
    const { clientId, operatorId, fromDate, toDate, page, limit } = request.body()

    const searchUser: SearchUserEntity = {
      clientId,
      operatorId,
      fromDate,
      toDate,
      page,
      limit,
    }

    try {
      const users = await this.userUseCase.getAllUsers(searchUser)
      if (users.length === 0)
        return response
          .status(404)
          .json({ error: 'No se encontraron usuarios con los parámetros especificados!' })

      return response.status(200).json({ message: 'Usuarios listados!', users })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public updatePassword = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = ctx['user']
    const { password } = request.body()
    if (!password) return response.status(401).json({ error: 'Debe enviar la nueva contraseña!' })

    const hashedPassword = await Hash.make(password)

    try {
      const user = await this.userUseCase.updatePassword(uuid, hashedPassword)
      if (!user) return response.status(404).json({ error: 'No existe el usuario!' })

      return response.status(200).json({ message: 'Contraseña actualizada!', user })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'No se pudo actualizar la contraseña. Vuelva a intentarlo!' })
    }
  }

  public updateUser = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = ctx['user']
    const { email, name, role, tokenWallet, userName } = request.body()

    if (!email && !name && !role && !tokenWallet && !userName)
      return response.status(404).json({ error: 'Debe enviar los datos que desea actualizar!' })

    const data: UpdateUserEntity = {
      email,
      name,
      role,
      tokenWallet,
      userName,
    }

    try {
      const user = await this.userUseCase.updateUser(uuid, data)
      if (!user) return response.status(404).json({ error: 'No se encontró el usuario!' })

      return response.status(200).json({ message: 'Usuario actualizado!', user })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo actualizar el usuario!' })
    }
  }

  public createUser = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { userName, name, lastName, email, password, rol, operator, client, tokenWallet } =
      request.body()

    const user: UserEntity = {
      userName,
      name,
      lastName,
      email,
      password,
      rol,
      operator,
      client,
      tokenWallet,
      status: true,
    }

    try {
      const clientExist = await clientUseCases.getClientByUuid(client)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const operatorExist = await operatorUseCases.getOperatorByUuid(operator)
      if (!operatorExist)
        return response.status(404).json({ error: 'No se encuentra el operador!' })

      const userCreated = await this.userUseCase.createUser(user)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Crear usuario!',
        ctx,
        user: userCreated,
      }
      await CreateAuditory(auditoryParams)

      return response.status(201).json({ message: 'Usuario creado!', userCreated })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo crear el usuario!' })
    }
  }

  public getUsersByClient = async ({ request, response }) => {
    const { clientUuid } = request.params()

    try {
      const clientExist = await clientUseCases.getClientByUuid(clientUuid)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const users = await this.userUseCase.getUsersByClient(clientUuid)
      if (users.length === 0)
        return response.status(404).json({ error: 'No existen usuarios asociados al cliente!' })

      return response.status(200).json({ message: 'Usuarios listados!', users })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudieron obtener los usuarios!' })
    }
  }
}
