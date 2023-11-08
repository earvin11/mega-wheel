import Redis from '@ioc:Adonis/Addons/Redis'
import { RoundRedisRepository } from '../../domain/repositories/round.redis.repository'
import { Phase, RoundEntity } from '../../domain'

export class RoundControlRedisRepository implements RoundRedisRepository {
  private PHASE_KEY = (table: string) => `round-control:${table}:phase`
  private ROUND_KEY = (roundUuid: string) => `round:${roundUuid}`

  public changeCurrentPhase = async (table: string, phase: Phase) => {
    await Redis.del(this.PHASE_KEY(table))
    await Redis.set(this.PHASE_KEY(table), phase)
  }

  public getCurrentPhase = async (table: string): Promise<Phase> => {
    const phase = await Redis.get(this.PHASE_KEY(table))
    if (!phase) {
      await Redis.set(this.PHASE_KEY(table), 'processing_next_round' as Phase)
      return 'processing_next_round' as Phase
    }
    return phase as Phase
  }

  public setRound = async (round: RoundEntity): Promise<void> => {
    const { uuid } = round
    const key = this.ROUND_KEY(uuid!)
    await Redis.set(key, JSON.stringify(round))
  }
  public getRound = async (roundUuid: string): Promise<RoundEntity | null> => {
    try {
      const round = await Redis.get(`round:${ roundUuid }`);
      if(round) return JSON.parse(round)
      return null;
    } catch (error) {
      throw error;
    }
  }
}
