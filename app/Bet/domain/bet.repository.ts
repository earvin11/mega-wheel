import { BetEntity } from './bet.entity';

export interface BetRepository {
    createBet(bet: BetEntity): Promise<BetEntity>;
    findAllBets(): Promise<BetEntity[] | []>;
    findBetByUuid(uuid: string): Promise<BetEntity | null>;
    payBet(uuid: string): Promise<BetEntity | null>;
};