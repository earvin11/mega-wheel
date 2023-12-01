import { wheelFortuneUseCases } from '../../WheelFortune/infraestructure/dependencies'
import { RoundControlRedisUseCases } from '../application/round-control.redis.use-cases'
import { RoundUseCases } from '../application/round.use-cases'
import { RoundControlRedisRepository } from './repositories/round.control.redis.repository'
import { RoundController } from './round.controller'
import { RoundMongoRepository } from './repositories/round.mongo-repository'
import { RoundBetUseCases } from '../../RoundBets/application/round-bet-use-case'
import { RoundBetMongoRepository } from '../../RoundBets/infraestructure/round-bet.repository'
import { BetControlRedisUseCases } from 'App/Bet/application/bet-control.redis.use-cases'
import { BetControlRedisRepository } from 'App/Bet/infraestructure/repositories/bet-control.redis-repository'
import { currencyUseCases } from '../../Currencies/infrastructure/dependencies'

export const roundControlRedisRepository = new RoundControlRedisRepository()
export const roundControlRedisUseCases = new RoundControlRedisUseCases(roundControlRedisRepository)
export const roundMongoRepository = new RoundMongoRepository()
export const roundBetRepository = new RoundBetMongoRepository()
export const roundUseCases = new RoundUseCases(roundMongoRepository)
export const roundBetUseCases = new RoundBetUseCases(roundBetRepository)
export const betControlRedisRepository = new BetControlRedisRepository()
export const betControlRedisUseCases = new BetControlRedisUseCases(betControlRedisRepository)

export const roundController = new RoundController(
  roundUseCases,
  roundControlRedisUseCases,
  wheelFortuneUseCases,
  roundBetUseCases,
  betControlRedisUseCases,
  currencyUseCases
)
