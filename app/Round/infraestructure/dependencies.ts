import { RoundUseCases } from '../application/round.use-cases';
import { RoundController } from './round.controller';
import { RoundMongoRepository } from './round.mongo-repository';

export const roundMongoRepository = new RoundMongoRepository();
export const roundUseCases = new RoundUseCases(roundMongoRepository);
export const roundController = new RoundController(
    roundUseCases
);