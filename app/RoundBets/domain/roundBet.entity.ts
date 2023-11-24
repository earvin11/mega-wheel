import { BetBody } from '../../Bet/domain'

export interface RoundBetEntity {
  numbers: BetBody[]
  uuid?: string
  roundUuid: string
  totalAmount: number
}
