import { UserEntity } from './user.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class User implements UserEntity {
  public client: string
  public email: string
  public lastName: string
  public name: string
  public password: string
  public rol: string
  public userClient: boolean
  public userName: string
  public uuid: string
  public status: boolean

  constructor(user: UserEntity) {
    const { uuid } = new GenerateId()
    this.client = user.client
    this.email = user.email
    this.lastName = user.lastName
    this.name = user.name
    this.password = user.password
    this.rol = user.rol
    this.userClient = <boolean>user.userClient
    this.userName = user.userName
    this.uuid = uuid
    this.status = true
  }
}
