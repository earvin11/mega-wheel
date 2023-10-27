import { RoleRepository } from '../domain/role.repository'
import { RoleEntity } from '../domain/role.entity'
import { Role } from '../domain/role.value'

export class RoleUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  public createRole = async (role: RoleEntity) => {
    const newRole = new Role(role)
    const roleCreated = await this.roleRepository.createRole(newRole)
    return roleCreated
  }

  public getAllRoles = async () => {
    const roles = await this.roleRepository.getAllRole()
    return roles
  }

  public deleteRole = async (uuid: string) => {
    const role = await this.roleRepository.deleteRole(uuid)
    return role
  }
}
