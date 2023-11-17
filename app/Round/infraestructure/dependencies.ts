import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'
import { RoundControlRedisUseCases } from '../application/round-control.redis.use-cases'
import { RoundUseCases } from '../application/round.use-cases'
import { RoundControlRedisRepository } from './repositories/round.control.redis.repository'
import { RoundController } from './round.controller'
import { RoundMongoRepository } from './repositories/round.mongo-repository'
import { RoundBetUseCases } from 'App/RoundBets/application/round-bet-use-case'
import { RoundBetMongoRepository } from 'App/RoundBets/infraestructure/round-bet.repository'

export const roundControlRedisRepository = new RoundControlRedisRepository()
export const roundControlRedisUseCases = new RoundControlRedisUseCases(roundControlRedisRepository)
export const roundMongoRepository = new RoundMongoRepository()
export const roundBetRepository = new RoundBetMongoRepository()
export const roundUseCases = new RoundUseCases(roundMongoRepository)
export const roundBetUseCases = new RoundBetUseCases(roundBetRepository)

export const roundController = new RoundController(
  roundUseCases,
  roundControlRedisUseCases,
  wheelFortuneUseCases,
  roundBetUseCases,
)
