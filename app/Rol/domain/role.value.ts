import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'
import { RoleEntity } from './role.entity'

export class Role implements RoleEntity {
  public name: string
  public uuid: string
  public status: boolean

  constructor(role: RoleEntity) {
    const { uuid } = new GenerateId()
    this.name = role.name
    this.uuid = uuid
    this.status = true
  }
}
