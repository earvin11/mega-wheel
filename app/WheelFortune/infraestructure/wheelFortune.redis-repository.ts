import { Phase } from "App/Game/domain/types/phase.interfaces";
import { WheelFortuneRedisRepository } from "../domain/wheel-fortune.redis.repository";
import Redis from "@ioc:Adonis/Addons/Redis";

export class WheelFortuneControlRedisRepository implements WheelFortuneRedisRepository {

  private PHASE_KEY = (table: string) => `game-control:${table}:phase`

  public changeCurrentPhase = async (table: string, phase: Phase) => {

    await Redis.del(this.PHASE_KEY(table));
    await Redis.set(this.PHASE_KEY(table), phase)
  }

  public getCurrentPhase = async (table: string) => {
    const phase = await Redis.get(this.PHASE_KEY(table))
    if (!phase) {
      await Redis.set(this.PHASE_KEY(table), 'initial_bet' as Phase)
      return 'initial_bet' as Phase
    }
    return phase as Phase
  }
}