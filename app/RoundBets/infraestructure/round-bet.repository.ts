import { BetBody } from 'App/Bet/domain'
import { RoundBetRepository } from '../domain/repositories/roundBet-repository'
import { RoundBetEntity } from '../domain/roundBet.entity'
import roundBetsModel from './round-bets.model'

export class RoundBetMongoRepository implements RoundBetRepository {
  public async createRoundBet(roundBet: RoundBetEntity): Promise<RoundBetEntity> {
    const newRoundBet = await roundBetsModel.create(roundBet)
    return newRoundBet
  }
  public async updateRoundBet(uuid: string, numbers: BetBody[]): Promise<RoundBetEntity | null> {
    const roundBet = await roundBetsModel
      .findOneAndUpdate(
        { uuid },
        { numbers },
        {
          new: true,
        },
      )
      .exec()
    if (!roundBet) return null

    return roundBet
  }
}
