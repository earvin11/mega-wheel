import { TransactionsUseCases } from '../application/transactionsUseCases'
import { TransactionsMongoRepository } from './transactions.repository'

export const transactionsMongoRepository = new TransactionsMongoRepository()
export const transactionsUseCases = new TransactionsUseCases(transactionsMongoRepository)
