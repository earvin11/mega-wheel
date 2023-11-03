import Redis from "@ioc:Adonis/Addons/Redis";
import { Phase } from "App/Game/domain/types/phase.interfaces";
import { RoundRedisRepository } from "../domain/repositories/round.redis.repository";
import { RoundEntity } from "../domain";


export class RoundControlRedisRepository implements RoundRedisRepository {

  private PHASE_KEY = (table: string) => `round-control:${table}:phase`
  private ROUNDS_KEY = (table: string) => `round-control:${table}:rounds`

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

  public setRound = async (uuid: string, providerId: string): Promise<string> => {
    const key = this.ROUNDS_KEY(providerId);
    const rounds = await Redis.get(key);
    const parsedRounds = JSON.parse(rounds!);
    const newRounds = parsedRounds.push(uuid) as RoundEntity[];
    await Redis.set(key, JSON.stringify(newRounds))
    return uuid
  }
}