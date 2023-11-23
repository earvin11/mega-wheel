import { BetBody } from 'App/Bet/domain'
import { RoundBetRepository } from '../domain/repositories/roundBet-repository'
import { RoundBetEntity } from '../domain/roundBet.entity'
import RoundBetModel from './round-bets.model'

export class RoundBetMongoRepository implements RoundBetRepository {
  public async createRoundBet(roundBet: RoundBetEntity): Promise<RoundBetEntity> {
    const newRoundBet = await RoundBetModel.create(roundBet)
    return newRoundBet
  }
  public async updateRoundBet(uuid: string, numbers: BetBody[]): Promise<RoundBetEntity | null> {
    let totalAmount = 0
    numbers.forEach((n) => {
      totalAmount += n.amount
    })
    const roundBet = await RoundBetModel.findOneAndUpdate(
      { uuid },
      { numbers, totalAmount },
      {
        new: true,
      },
    ).exec()
    if (!roundBet) return null

    return roundBet
  }
}
