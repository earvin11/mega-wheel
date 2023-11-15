import { BetBody } from 'App/Bet/domain'
import { RoundBetRepository } from '../domain/repositories/roundBet-repository'
import { RoundBet } from '../domain/round-bet.value'
import { RoundBetEntity } from '../domain/roundBet.entity'

export class RoundBetUseCases {
  constructor(private readonly roundBetRepository: RoundBetRepository) {}

  public createRoundBet = async (roundBet: RoundBetEntity) => {
    try {
      const newRoundBet = new RoundBet(roundBet)
      const betCreated = await this.roundBetRepository.createRoundBet(newRoundBet)
      return betCreated
    } catch (error) {
      throw error
    }
  }

  public updateRoundBet = async (uuid: string, numbers: BetBody[]) => {
    const client = await this.roundBetRepository.updateRoundBet(uuid, numbers)
    return client
  }
}
