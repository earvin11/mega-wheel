import Redis from '@ioc:Adonis/Addons/Redis';
import { BetEntity, BetRedisRepository } from '../../domain';

export class BetControlRedisRepository implements BetRedisRepository {
    private BET_KEY = (roundId: string) => `bets:${roundId}`
    
    public setBet = async (bet: BetEntity): Promise<void> => {
        try {
            const { roundUuid } = bet
            const key = this.BET_KEY(roundUuid!)
            const betsString = await Redis.get(key)
            const betsData: BetEntity[] = betsString ? JSON.parse(betsString as string) : []
            betsData.push(bet)
            await Redis.set(key, JSON.stringify(betsData))
        } catch (error) {
            throw error
        }
    }

}