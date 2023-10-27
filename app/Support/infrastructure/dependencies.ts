import { SupportMongoRepository } from './support.repository'
import { SupportUseCases } from '../application/supportUseCases'
import { SupportController } from './support.controller'

export const supportMongoRepository = new SupportMongoRepository()
export const supportUseCases = new SupportUseCases(supportMongoRepository)
export const supportController = new SupportController(supportUseCases)
