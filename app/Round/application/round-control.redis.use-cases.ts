import { Phase } from "App/Game/domain/types/phase.interfaces";
import { RoundRedisRepository } from "../domain/round.redis.repository";

export class RoundControlRedisUseCases {
  constructor(
    private readonly roundRedisRepository: RoundRedisRepository
  ) { }

  public toPhase = async (table: string, phase: Phase) => {
    await this.roundRedisRepository.changeCurrentPhase(table, phase)
  }

  public getPhase = async (table: string) => {
    return await this.roundRedisRepository.getCurrentPhase(table)
  }
}