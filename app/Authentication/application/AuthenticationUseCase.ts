import { AuthenticationRepository } from '../domain/authentication.repository'
import { UserLoginEntity } from '../domain/login.entity'
import { UserLogin } from '../domain/login.value'
import { UserRegisterEntity } from '../domain/register.entity'
import { UserRegister } from '../domain/register.value'

export class AuthenticationUseCase {
  constructor(private readonly authenticationRepository: AuthenticationRepository) {}

  public register = async (userRegister: UserRegisterEntity) => {
    const user = new UserRegister(userRegister)
    const registeredUser = await this.authenticationRepository.register(user)

    return registeredUser
  }

  public login = async (userLogin: UserLoginEntity) => {
    const user = new UserLogin(userLogin)
    const loggedUser = await this.authenticationRepository.login(user)

    return loggedUser
  }

  public getUserbyUserName = async (userName: string) => {
    const user = await this.authenticationRepository.getUserByUserName(userName)
    return user
  }

  public getUserByToken = async (uuid: string) => {
    const user = await this.authenticationRepository.getUserByToken(uuid)
    return user
  }

  public forgotPassword = async (email: string) => {
    const user = await this.authenticationRepository.forgotPassword(email)
    return user
  }

  public recoverPassword = async (email: string, password: string) => {
    await this.authenticationRepository.recoverPassword(email, password)
  }
}
