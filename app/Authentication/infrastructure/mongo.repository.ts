import { AuthenticationRepository } from '../domain/authentication.repository'
import { UserLoginEntity } from '../domain/login.entity'
import { UserRegisterEntity } from '../domain/register.entity'

import UserModel from '../../User/infrastructure/user.model'

export class MongoRepository implements AuthenticationRepository {
  public register = async (user: UserRegisterEntity): Promise<UserRegisterEntity | null> => {
    const registeredUser = await UserModel.create(user)
    if (!registeredUser) return null

    return registeredUser
  }

  public login = async (userLogin: UserLoginEntity): Promise<UserRegisterEntity | null> => {
    const user = await UserModel.findOne({ userName: userLogin.userName })
    if (!user) return null

    return user
  }

  public getUserByUserName = async (userName: string): Promise<UserRegisterEntity | null> => {
    const user = await UserModel.findOne({ userName })
    if (!user) return null

    return user
  }

  public getUserByToken = async (uuid: string): Promise<UserRegisterEntity | null> => {
    const user = await UserModel.findOne({ uuid })
    if (!user) return null

    return user
  }

  public forgotPassword = async (email: string): Promise<UserRegisterEntity | null> => {
    const user = await UserModel.findOne({ email })
    if (!user) return null

    return user
  }

  public recoverPassword = async (email: string, password: string): Promise<void> => {
    await UserModel.findOneAndUpdate({ email }, { password })
  }
}
