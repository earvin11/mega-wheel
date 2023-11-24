import { BetBody } from '../../Bet/domain'
import { RoundBetRepository } from '../domain/repositories/roundBet-repository'
import { RoundBetEntity } from '../domain/roundBet.entity'
import RoundBetModel from './round-bets.model'

export class RoundBetMongoRepository implements RoundBetRepository {
  public async createRoundBet(roundBet: RoundBetEntity): Promise<RoundBetEntity> {
    const newRoundBet = await RoundBetModel.create(roundBet)
    return newRoundBet
  }
  public async updateRoundBet(uuid: string, numbers: BetBody[]): Promise<RoundBetEntity | null> {
    const roundBet = await RoundBetModel.findOneAndUpdate(
      { uuid },
      { numbers },
      {
        new: true,
      },
    ).exec()
    if (!roundBet) return null

    return roundBet
  }
}
