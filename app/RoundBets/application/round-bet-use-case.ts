import { BetBody } from 'App/Bet/domain'
import { RoundBetRepository } from '../domain/repositories/roundBet-repository'
import { RoundBet } from '../domain/round-bet.value'
import { RoundBetEntity } from '../domain/roundBet.entity'
import { numbers } from 'App/Bet/domain/Number'

export class RoundBetUseCases {
  constructor(private readonly roundBetRepository: RoundBetRepository) {}

  public createRoundBet = async (roundBet: RoundBetEntity) => {
    const { roundUuid } = roundBet
    try {
      const newRoundBet = new RoundBet({
        roundUuid,
        numbers: numbers.map((n) => ({ number: n, amount: 0 })),
      })
      const roundBet = await this.roundBetRepository.createRoundBet(newRoundBet)
      return roundBet
    } catch (error) {
      throw error
    }
  }

  public updateRoundBet = async (uuid: string, numbers: BetBody[]) => {
    const roundBet = await this.roundBetRepository.updateRoundBet(uuid, numbers)
    return roundBet
  }
}
