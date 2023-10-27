import UserModel from 'App/User/infrastructure/user.model'
import { SearchUserEntity } from '../domain/search.entity'
import { UpdateUserEntity } from '../domain/updateUser.entity'
import { UserEntity } from '../domain/user.entity'
import { UserRepository } from '../domain/user.repository'

export class MongoUserRepository implements UserRepository {
  public getUserById = async (uuid: string): Promise<UserEntity | null> => {
    const user = await UserModel.findOne({ uuid }).exec()
    if (!user) return null

    return user
  }

  public deleteUser = async (uuid: string): Promise<UserEntity | null> => {
    const user = await UserModel.findOneAndDelete({ uuid }).exec()
    if (!user) return null

    return user
  }

  public getAllUsers = async (searchUser: SearchUserEntity): Promise<UserEntity[] | []> => {
    const findUsersParams = {}

    if (searchUser.clientId) findUsersParams['client'] = searchUser.clientId
    if (searchUser.operatorId) findUsersParams['operator'] = searchUser.operatorId

    if (searchUser.fromDate && searchUser.toDate) {
      if (searchUser.toDate === searchUser.fromDate) {
        const [year, month, day] = searchUser.fromDate.split('-')

        findUsersParams['createdAt'] = {
          $lte: new Date(`${month}-${day}-${year} 23:59:59`),
          $gte: new Date(`${month}-${day}-${year} 00:00:00`),
        }
      } else {
        findUsersParams['createdAt'] = {
          $lte: new Date(searchUser.toDate),
          $gte: new Date(searchUser.fromDate),
        }
      }
    }

    const users = await UserModel.find(findUsersParams)
      .skip(searchUser.page)
      .limit(searchUser.limit)
      .exec()

    return users
  }

  public updatePassword = async (uuid: string, password: string): Promise<UserEntity | null> => {
    const user = await UserModel.findOneAndUpdate({ uuid }, { password }, { new: true }).exec()
    if (!user) return null

    return user
  }

  public updateUser = async (uuid: string, data: UpdateUserEntity): Promise<UserEntity | null> => {
    const user = await UserModel.findOneAndUpdate({ uuid }, data, { new: true }).exec()
    if (!user) return null

    return user
  }

  public createUser = async (user: UserEntity): Promise<UserEntity> => {
    const newUser = await UserModel.create(user)
    return newUser
  }

  public getUsersByClient = async (clientUuid: string): Promise<UserEntity[] | []> => {
    const users = await UserModel.find({ client: clientUuid }).exec()
    return users
  }
}
