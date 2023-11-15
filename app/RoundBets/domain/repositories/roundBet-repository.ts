import { RoundBetEntity } from '../roundBet.entity'

export interface RoundBetRepository {
  createRoundBet(bet: RoundBetEntity): Promise<void>
}
