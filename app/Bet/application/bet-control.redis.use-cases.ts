import { BetEntity } from '../domain';
import { BetRedisRepository } from '../domain/repositories/bet.redis-repository';

export class BetControlRedisUseCases {
  constructor(
    private betRedisRepository: BetRedisRepository
  ) { }

  public setBet = async (bet: BetEntity) => {
    try {
      await this.betRedisRepository.setBet(bet);
    } catch (error) {
      throw error;
    }
  }

  public getBetsByRound = async (roundUuid: string) => {
    try {
      const bets = await this.betRedisRepository.getBetsByRound(roundUuid);
      return bets
    } catch (error) {
      throw error;
    }
  }
}