import { BetEntity } from '../bet.entity';

export interface BetRedisRepository {
    setBet(bet: BetEntity): Promise<void>;
    getBetsByRound(roundUuid: string): Promise<BetEntity[] | []>;
};