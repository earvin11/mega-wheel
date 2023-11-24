// import { clientUseCases } from '../../Client/infrastructure/dependencies';
import { OperatorUseCases } from '../application/OperatorUseCases'
import { OperatorController } from './operator.controller'
import { OperatorMongoRepository } from './operator.repository'
import { currencyUseCases } from '../../Currencies/infrastructure/dependencies'
import { chipUseCases } from '../../Chip/infrastructure/dependencies'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'
import { ClientUseCases } from '../../Client/application/ClientUseCases'
import { ClientMongoRepository } from '../../Client/infrastructure/client.repository'

const operatorRepository = new OperatorMongoRepository()
export const operatorUseCases = new OperatorUseCases(operatorRepository)

export const clientRepository = new ClientMongoRepository()
export const clientUseCases = new ClientUseCases(clientRepository)

const operatorController = new OperatorController(
    operatorUseCases,
    clientUseCases,
    wheelFortuneUseCases,
    currencyUseCases,
    chipUseCases,
);

export default operatorController
