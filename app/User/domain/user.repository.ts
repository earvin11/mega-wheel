import { SearchUserEntity } from './search.entity'
import { UserEntity } from './user.entity'
import { UpdateUserEntity } from './updateUser.entity'

export interface UserRepository {
  getUserById(uuid: string): Promise<UserEntity | null>
  deleteUser(uuid: string): Promise<UserEntity | null>
  getAllUsers(searchUser: SearchUserEntity): Promise<UserEntity[] | []>
  updatePassword(uuid: string, password: string): Promise<UserEntity | null>
  updateUser(uuid: string, data: UpdateUserEntity): Promise<UserEntity | null>
  createUser(user: UserEntity): Promise<UserEntity>
  getUsersByClient(clientUuid: string): Promise<UserEntity[] | []>
}
