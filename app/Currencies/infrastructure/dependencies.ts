import { CurrencyUseCases } from '../application/currencyUseCases'
import { CurrencyController } from './currency.controller'
import { CurrencyMongoRepository } from './currency.repository'

export const currencyMongoRepo = new CurrencyMongoRepository()
export const currencyUseCases = new CurrencyUseCases(currencyMongoRepo)
export const currencyController = new CurrencyController(currencyUseCases)
