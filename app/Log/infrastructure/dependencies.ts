import { LogUseCases } from '../application/LogUseCases'
import { LogController } from './log.controller'
import { MongoLogRepository } from './log.repository'

export const logMongoRepository = new MongoLogRepository()
export const logUseCases = new LogUseCases(logMongoRepository)
export const logController = new LogController(logUseCases)
