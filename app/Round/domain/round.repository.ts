import { RoundEntity } from './round.entity';

export interface RoundRepository {
    createRound(round: RoundEntity): Promise<RoundEntity>;
    findRounds(): Promise<RoundEntity[] | []>;
    findRoundByUuid(uuid: string): Promise<RoundEntity | null>;
    findRoundsByProviderId(providerId: string): Promise<RoundEntity[] | []>;
    closeRound(uuid: string, result: number): Promise<RoundEntity | null>;
};