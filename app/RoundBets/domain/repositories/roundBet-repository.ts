import { BetBody } from '../../../Bet/domain'
import { RoundBetEntity } from '../roundBet.entity'

export interface RoundBetRepository {
  createRoundBet(bet: RoundBetEntity): Promise<RoundBetEntity>
  updateRoundBet(uuid: string, numbers: BetBody[]): Promise<RoundBetEntity | null>
}
