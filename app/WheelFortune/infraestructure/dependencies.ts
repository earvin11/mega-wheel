import { WheelFortuneUseCases } from '../apllication/wheel-fortune.use-cases'
import { WheelFortuneController } from './wheelFortune.controller'
import { WheelFortuneMongoRepository } from './wheelFortune.mongo-repository'

export const wheelFortuneMongoRepository = new WheelFortuneMongoRepository()
export const wheelFortuneUseCases = new WheelFortuneUseCases(wheelFortuneMongoRepository)
export const wheelFortuneController = new WheelFortuneController(wheelFortuneUseCases)
