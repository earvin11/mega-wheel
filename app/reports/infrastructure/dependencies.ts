import { OperatorUseCases } from 'App/Operator/application/OperatorUseCases'
import { ReportsUseCases } from '../application/ReportsUseCases'
import { ReportsController } from './reports.controller'
import { ReportsMongoRepository } from './reports.repository'
import { OperatorMongoRepository } from 'App/Operator/infrastructure/operator.repository'

export const operatorRepository = new OperatorMongoRepository()
export const operatorUseCases = new OperatorUseCases(operatorRepository)

export const reportsMongoRepository = new ReportsMongoRepository(operatorUseCases)
export const reportsUseCases = new ReportsUseCases(reportsMongoRepository)
export const reportsController = new ReportsController(reportsUseCases)
