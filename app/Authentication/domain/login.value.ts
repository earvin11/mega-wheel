import { UserLoginEntity } from './login.entity'

export class UserLogin implements UserLoginEntity {
  public userName: string
  public password: string

  constructor({ userName, password }: UserLoginEntity) {
    this.userName = userName
    this.password = password
  }
}
