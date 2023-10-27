import { RoleUseCase } from '../application/RoleUseCase'
import { RoleController } from './role.controller'
import { MongoRoleRepository } from './role.repository'

export const roleMongoRepository = new MongoRoleRepository()
export const roleUseCase = new RoleUseCase(roleMongoRepository)
export const roleController = new RoleController(roleUseCase)
