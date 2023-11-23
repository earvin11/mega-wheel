import { GenerateId } from 'App/Shared/Helpers/generate-id.helpers'
import { RoundBetEntity } from './roundBet.entity'
import { BetBody } from 'App/Bet/domain'

export class RoundBet implements RoundBetEntity {
  public uuid: string
  public roundUuid: string
  public totalAmount: number
  public numbers: BetBody[]

  constructor(roundBet: RoundBetEntity) {
    this.uuid = new GenerateId().uuid
    this.roundUuid = roundBet.roundUuid
    this.numbers = roundBet.numbers
    this.totalAmount = roundBet.totalAmount
  }
}
