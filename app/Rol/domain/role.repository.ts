import { RoleEntity } from './role.entity'

export interface RoleRepository {
  createRole(role: RoleEntity): Promise<RoleEntity>
  getAllRole(): Promise<RoleEntity[] | []>
  deleteRole(uuid: string): Promise<RoleEntity | null>
}
