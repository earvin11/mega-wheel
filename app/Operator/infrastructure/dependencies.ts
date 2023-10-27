import { clientUseCases } from 'App/Client/infrastructure/dependencies'
import { OperatorUseCases } from '../application/OperatorUseCases'
import { OperatorController } from './operator.controller'
import { OperatorMongoRepository } from './operator.repository'
// import { gameUseCases } from 'App/Game/infrastructure/dependencies'
import { currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import { chipUseCases } from 'App/Chip/infrastructure/dependencies'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'

const operatorRepository = new OperatorMongoRepository(
    chipUseCases
)
export const operatorUseCases = new OperatorUseCases(operatorRepository)
const operatorController = new OperatorController(
    operatorUseCases,
    clientUseCases,
    // gameUseCases,
    wheelFortuneUseCases,
    currencyUseCases,
    chipUseCases
);

export default operatorController
