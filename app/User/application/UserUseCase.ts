import { SearchUserEntity } from '../domain/search.entity'
import { UserRepository } from '../domain/user.repository'
import { UpdateUserEntity } from '../domain/updateUser.entity'
import { UserEntity } from '../domain/user.entity'
import { User } from '../domain/user.value'

export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public getUserById = async (uuid: string) => {
    const user = await this.userRepository.getUserById(uuid)
    return user
  }

  public deleteUser = async (uuid: string) => {
    const user = await this.userRepository.deleteUser(uuid)
    return user
  }

  public getAllUsers = async (searchUser: SearchUserEntity) => {
    const users = await this.userRepository.getAllUsers(searchUser)
    return users
  }

  public updatePassword = async (uuid: string, password: string) => {
    const user = await this.userRepository.updatePassword(uuid, password)
    return user
  }

  public updateUser = async (uuid: string, data: UpdateUserEntity) => {
    const user = await this.userRepository.updateUser(uuid, data)
    return user
  }

  public createUser = async (user: UserEntity) => {
    const newUser = new User(user)
    const userCreated = await this.userRepository.createUser(newUser)
    return userCreated
  }

  public getUsersByClient = async (clientUuid: string) => {
    const users = await this.userRepository.getUsersByClient(clientUuid)
    return users
  }
}
