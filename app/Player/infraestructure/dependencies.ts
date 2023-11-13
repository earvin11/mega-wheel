import { PlayerUseCases } from '../application/player.use-cases'
import { PlayerMongoRepository } from './player.mongo-repository'

export const playerMongoRepository = new PlayerMongoRepository()
export const playerUseCases = new PlayerUseCases(playerMongoRepository)
