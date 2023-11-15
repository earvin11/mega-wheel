import { GenerateId } from 'App/Shared/Helpers/generate-id.helpers'
import { Jackpot, RoundEntity } from './round.entity'

export class Round implements RoundEntity {
  public result: number | null
  public open: boolean
  public start_date: Date
  public end_date?: Date
  public jackpot?: Jackpot
  public gameUuid: string
  public providerId: string
  public identifierNumber: string
  public uuid: string

  constructor(round: RoundEntity) {
    this.result = null
    this.open = true
    this.start_date = round.start_date
    this.end_date = round.end_date
    this.jackpot = round.jackpot
    this.gameUuid = round.gameUuid
    this.providerId = round.providerId
    this.identifierNumber = round.identifierNumber
    this.uuid = new GenerateId().uuid
  }
}
