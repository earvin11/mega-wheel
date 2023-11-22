import { BetBody } from 'App/Bet/domain'

export interface RoundBetEntity {
  numbers: BetBody[]
  uuid?: string
  roundUuid: string
}
