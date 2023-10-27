import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'
import { AuditoryEntity } from './auditory.entity'

export class Auditory implements AuditoryEntity {
  public action: string
  public ipAddress: string
  public resource: string
  public route: string
  public typeAction: string
  public user_uuid: string
  public uuid: string

  constructor({ action, ipAddress, resource, route, typeAction, user_uuid }: AuditoryEntity) {
    const { uuid } = new GenerateId()
    this.action = action
    this.ipAddress = ipAddress
    this.resource = resource
    this.route = route
    this.typeAction = typeAction
    this.user_uuid = user_uuid
    this.uuid = uuid
  }
}
