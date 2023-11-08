import { roundControlRedisUseCases, roundUseCases } from 'App/Round/infraestructure/dependencies'
import { BetUseCases } from '../application/bet.use-cases'
import { BetController } from './bet.controller'
import { BetMongoRepository } from './repositories/bet.repository'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'

export const betMongoRepository = new BetMongoRepository()
export const betUseCases = new BetUseCases(betMongoRepository)
export const betController = new BetController(
    betUseCases,
    roundUseCases,
    wheelFortuneUseCases,
    roundControlRedisUseCases
)
