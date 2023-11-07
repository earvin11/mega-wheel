import { Bet, BetEntity, BetRepository } from '../domain'

export class BetUseCases {
  constructor(private readonly betRepository: BetRepository) {}

  public createBet = async (bet: BetEntity) => {
    try {
      const newBet = new Bet(bet)
      const betCreated = await this.betRepository.createBet(newBet)
      return betCreated
    } catch (error) {
      throw error
    }
  }

  public findBetByUuid = async (uuid: string) => {
    try {
      const bet = await this.betRepository.findBetByUuid(uuid)
      return bet
    } catch (error) {
      throw error
    }
  }

  public payBet = async (uuid: string) => {
    try {
      const betIsPaid = await this.betRepository.payBet(uuid)
      return betIsPaid
    } catch (error) {
      throw error
    }
  }
  public getWinner = async (filter: any) => {
    const betWinner = await this.betRepository.getWinner(filter)

    return betWinner
  }
  public getWinners = async (filter: any) => {
    const betWinners = await this.betRepository.getWinners(filter)

    return betWinners
  }
}
