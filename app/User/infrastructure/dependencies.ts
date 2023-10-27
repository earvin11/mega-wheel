import { UserUseCase } from '../application/UserUseCase'
import { UserController } from './user.controller'
import { MongoUserRepository } from './user.repository'

const userMongoRepository = new MongoUserRepository()
const userUseCase = new UserUseCase(userMongoRepository)
const userController = new UserController(userUseCase)

export default userController
