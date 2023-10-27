import { UserLoginEntity } from './login.entity'
import { UserRegisterEntity } from './register.entity'

export interface AuthenticationRepository {
  register(userRegister: UserRegisterEntity): Promise<UserRegisterEntity | null>
  login(userLogin: UserLoginEntity): Promise<UserRegisterEntity | null>
  getUserByUserName(userName: string): Promise<UserRegisterEntity | null>
  getUserByToken(uuid: string): Promise<UserRegisterEntity | null>
  forgotPassword(email: string): Promise<UserRegisterEntity | null>
  recoverPassword(email: string, password: string): Promise<void>
}
