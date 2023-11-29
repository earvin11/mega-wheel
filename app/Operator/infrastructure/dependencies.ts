import { OperatorUseCases } from '../application/OperatorUseCases'
import { OperatorController } from './operator.controller'
import { OperatorMongoRepository } from './operator.repository'
import { currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import { chipUseCases } from 'App/Chip/infrastructure/dependencies'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'
import { ClientUseCases } from 'App/Client/application/ClientUseCases'
import { ClientMongoRepository } from 'App/Client/infrastructure/client.repository'

export const clientRepository = new ClientMongoRepository()
export const clientUseCases = new ClientUseCases(clientRepository)

const operatorRepository = new OperatorMongoRepository()

export const operatorUseCases = new OperatorUseCases(operatorRepository)
const operatorController = new OperatorController(
  operatorUseCases,
  clientUseCases,
  wheelFortuneUseCases,
  currencyUseCases,
  chipUseCases,
)

export default operatorController
