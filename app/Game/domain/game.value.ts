import { GameEntity } from './game.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Game implements GameEntity {
  public active: boolean
  public manualDisable: boolean
  public maxBet: number
  public minBet: number
  public name: string
  public providerId: string
  public operator: string
  public status: boolean
  public uuid: string

  constructor(game: GameEntity) {
    const { uuid } = new GenerateId()
    this.active = true
    this.manualDisable = false
    this.maxBet = game.maxBet
    this.minBet = game.minBet
    this.name = game.name
    this.providerId = game.providerId
    this.operator = game.operator
    this.status = true
    this.uuid = uuid
  }
}
