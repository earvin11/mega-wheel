import { ClientMongoRepository } from './client.repository'
import { ClientUseCases } from '../application/ClientUseCases'
import { ClientController } from './client.controller'

export const clientMongoRepository = new ClientMongoRepository()
export const clientUseCases = new ClientUseCases(clientMongoRepository)
export const clientController = new ClientController(clientUseCases)
