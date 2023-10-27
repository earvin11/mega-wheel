import { LogUseCase } from '../application/LogUseCase'
import { LogController } from './log.controller'
import { MongoLogRepository } from './log.repository'

export const logMongoRepository = new MongoLogRepository()
export const logUseCase = new LogUseCase(logMongoRepository)
export const logController = new LogController(logUseCase)
