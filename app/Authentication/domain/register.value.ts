import { GenerateId } from 'App/Shared/Helpers/generate-id.helpers'
import { UserRegisterEntity } from './register.entity'

export class UserRegister implements UserRegisterEntity {
  public name: string
  public lastName: string
  public userName: string
  public email: string
  public password: string
  public client: string
  public rol: string
  public uuid: string
  public status: boolean

  constructor({ name, lastName, userName, email, password, client, rol }: UserRegisterEntity) {
    const { uuid } = new GenerateId()
    this.name = name
    this.lastName = lastName
    this.userName = userName
    this.email = email
    this.password = password
    this.client = client
    this.rol = rol
    this.uuid = uuid
    this.status = true
  }
}
