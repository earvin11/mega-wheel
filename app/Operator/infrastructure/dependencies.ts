import { clientUseCases } from 'App/Client/infrastructure/dependencies'
import { OperatorUseCases } from '../application/OperatorUseCases'
import { OperatorController } from './operator.controller'
import { OperatorMongoRepository } from './operator.repository'
import { currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import { chipUseCases } from 'App/Chip/infrastructure/dependencies'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'

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
