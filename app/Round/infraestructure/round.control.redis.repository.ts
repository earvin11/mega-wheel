import Redis from "@ioc:Adonis/Addons/Redis";
import { Phase } from "App/Game/domain/types/phase.interfaces";
import { RoundRedisRepository } from "../domain/repositories/round.redis.repository";

export class RoundControlRedisRepository implements RoundRedisRepository {

  private PHASE_KEY = (table: string) => `round-control:${table}:phase`

  public changeCurrentPhase = async (table: string, phase: Phase) => {

    await Redis.del(this.PHASE_KEY(table));
    await Redis.set(this.PHASE_KEY(table), phase)
  }

  public getCurrentPhase = async (table: string) => {
    const phase = await Redis.get(this.PHASE_KEY(table))
    if (!phase) {
      await Redis.set(this.PHASE_KEY(table), 'bet_time' as Phase)
      return 'bet_time' as Phase
    }
    return phase as Phase
  }
}