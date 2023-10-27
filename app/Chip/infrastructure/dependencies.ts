import { ChipUseCases } from '../application/ChipUseCase'
import { ChipController } from './chip.controller'
import { MongoChipRepository } from './chip.repository'

export const chipMongoRepository = new MongoChipRepository()
export const chipUseCases = new ChipUseCases(chipMongoRepository)
export const chipController = new ChipController(chipUseCases)
