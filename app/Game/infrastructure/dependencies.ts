import { GameUseCases } from '../application/GameUseCases'
import { GameMongoRepository } from './game.repository'
import { GameController } from './game.controller'

export const gameMongoRepository = new GameMongoRepository()
export const gameUseCases = new GameUseCases(gameMongoRepository)
export const gameController = new GameController(gameUseCases)
