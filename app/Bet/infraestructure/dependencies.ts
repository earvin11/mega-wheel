import {
    roundUseCases 
} from '../../Round/infraestructure/dependencies'
import { BetUseCases } from '../application/bet.use-cases'
import { BetController } from './bet.controller'
import { BetMongoRepository } from './repositories/bet.repository'
import { wheelFortuneUseCases } from '../../WheelFortune/infraestructure/dependencies'
import { BetControlRedisUseCases } from '../application/bet-control.redis.use-cases';
import { BetControlRedisRepository } from './repositories/bet-control.redis-repository';

export const betControlRedisRepository = new BetControlRedisRepository()
export const betMongoRepository = new BetMongoRepository()

export const betControlRedisUseCases = new BetControlRedisUseCases(betControlRedisRepository)
export const betUseCases = new BetUseCases(
    betMongoRepository,
)

export const betController = new BetController(
    betUseCases,
    roundUseCases,
    wheelFortuneUseCases,
)
