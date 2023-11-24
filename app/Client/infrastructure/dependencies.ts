import { ClientController } from './client.controller'
import { clientUseCases } from 'App/Operator/infrastructure/dependencies'

export const clientController = new ClientController(
    clientUseCases
)
