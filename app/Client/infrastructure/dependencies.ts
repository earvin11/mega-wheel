import { clientUseCases } from 'App/Operator/infrastructure/dependencies'
import { ClientController } from './client.controller'

export const clientController = new ClientController(clientUseCases)
