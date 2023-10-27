import { ExchangeUseCases } from '../application/exchangeUseCases'
import { ExchangeController } from './exchange.controller'
import { ExchangeMongoRepository } from './exchange.repository'

export const exchangeMongoRepository = new ExchangeMongoRepository()
export const exchangeUseCases = new ExchangeUseCases(exchangeMongoRepository)
export const exchangeController = new ExchangeController(exchangeUseCases)
