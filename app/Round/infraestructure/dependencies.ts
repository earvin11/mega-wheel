import { RoundUseCases } from '../application/round.use-cases';
import { RoundMongoRepository } from './round.mongo-repository';

export const roundMongoRepository = new RoundMongoRepository();
export const roundUseCases = new RoundUseCases(roundMongoRepository);