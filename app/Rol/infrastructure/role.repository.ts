import { RoleEntity } from '../domain/role.entity'
import { RoleRepository } from '../domain/role.repository'
import RoleModel from './role.model'

export class MongoRoleRepository implements RoleRepository {
  public createRole = async (role: RoleEntity): Promise<RoleEntity> => {
    const newRole = await RoleModel.create(role)
    return newRole
  }

  public getAllRole = async (): Promise<RoleEntity[] | []> => {
    const roles = await RoleModel.find({ status: true }).exec()
    return roles
  }

  public deleteRole = async (uuid: string): Promise<RoleEntity | null> => {
    const user = await RoleModel.findOneAndUpdate({ uuid }, { status: false }, { new: true }).exec()
    if (!user) return null

    return user
  }
}
