import { RoundMongoRepository } from 'App/Round/infraestructure/repositories/round.mongo-repository'
import { TransactionsUseCases } from '../application/transactionsUseCases'
import { TransactionsMongoRepository } from './transactions.repository'
import { currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import { RoundUseCases } from 'App/Round/application/round.use-cases'

const roundrepo = new RoundMongoRepository()
const roundUseCases = new RoundUseCases(roundrepo)

export const transactionsMongoRepository = new TransactionsMongoRepository(
  roundUseCases,
  currencyUseCases,
)
export const transactionsUseCases = new TransactionsUseCases(transactionsMongoRepository)
