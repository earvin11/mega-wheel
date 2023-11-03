import { Jackpot, RoundEntity } from '../round.entity';

export interface RoundRepository {
    createRound(round: RoundEntity): Promise<RoundEntity>;
    findRounds(): Promise<RoundEntity[] | []>;
    findRoundByUuid(uuid: string): Promise<RoundEntity | null>;
    findRoundsByProviderId(providerId: string): Promise<RoundEntity[] | []>;
    closeBetsInRound(uuid: string): Promise<RoundEntity | null>;
    setJackpotInRound(uuid: string, jackpotValue: Jackpot): Promise<RoundEntity | null>;
    closeRound(uuid: string, result: number): Promise<RoundEntity | null>;
    closeRounds(providerId: string, result: number): Promise<any>;
    createManyRounds(rounds: RoundEntity[]): Promise<RoundEntity[]>;
};