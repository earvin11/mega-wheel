import { Phase } from "App/Game/domain/types/phase.interfaces";
import { WheelFortuneRedisRepository } from "../domain/wheel-fortune.redis.repository";

export class WheelFortuneControlRedisUseCases {
  constructor(
    private readonly wheelFortuneRedisRepository: WheelFortuneRedisRepository
  ) { }

  public toPhase = async (table: string, phase: Phase) => {
    await this.wheelFortuneRedisRepository.changeCurrentPhase(table, phase)
  }

  public getPhase = async (table: string) => {
    return await this.wheelFortuneRedisRepository.getCurrentPhase(table)
  }
}