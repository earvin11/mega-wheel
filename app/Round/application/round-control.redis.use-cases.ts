import { Phase, RoundEntity } from "../domain";
import { RoundRedisRepository } from "../domain/repositories/round.redis.repository";

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

  public setRound = async (round: RoundEntity) => {
    return await this.roundRedisRepository.setRound(round);
  }

  public getRound = async (roundUuid: string) => {
    return await this.roundRedisRepository.getRound(roundUuid);
  }

  public setGamesActive = async (games: string[]) => {
    return await this.roundRedisRepository.setGamesActive(games)
  }
}