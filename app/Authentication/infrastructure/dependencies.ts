import { AuthenticationUseCase } from '../application/AuthenticationUseCase'
import { AuthenticationController } from './authentication.controller'
import { MongoRepository } from './mongo.repository'

const mongoRepository = new MongoRepository()
export const authenticationUseCase = new AuthenticationUseCase(mongoRepository)
const authenticationController = new AuthenticationController(authenticationUseCase)

export default authenticationController
