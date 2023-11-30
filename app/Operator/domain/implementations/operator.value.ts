import { OperatorEntity } from '../entities/operator.entity'
import { GenerateId } from '../../../Shared/Helpers/generate-id.helpers'
import {
  ConfigPaymentEntity,
  OperatorGameLimitsEntity,
} from '../entities/operator-game-limits.entity'

export class Operator implements OperatorEntity {
  public available: boolean
  public casinoToken: string
  public client: string
  public endpointAuth: string
  public name: string
  public endpointBet: string
  public endpointRollback: string
  public endpointWin: string
  public maxBet: number
  public minBet: number
  public status: boolean
  public uuid: string
  public operatorId: number
  // public chips: string[];
  public currencies?: string[]
  public operatorGamesLimits?: OperatorGameLimitsEntity[]

  constructor(operator: OperatorEntity) {
    const { uuid } = new GenerateId()
    this.status = true
    this.uuid = uuid
    this.available = true
    this.casinoToken = operator.casinoToken
    this.client = operator.client
    this.endpointAuth = operator.endpointAuth
    this.name = operator.name
    this.endpointBet = operator.endpointBet
    this.endpointRollback = operator.endpointRollback
    this.endpointWin = operator.endpointWin
    this.maxBet = operator.maxBet
    this.minBet = operator.minBet
    this.operatorId = operator.operatorId
    // this.chips = []
    this.currencies = operator.currencies
    this.operatorGamesLimits = operator.operatorGamesLimits
  }

  public getGameInOperator(gameUuid: string): Boolean {
    const gameFound = this.operatorGamesLimits?.find(
      (gameLimit) => gameLimit.game.uuid === gameUuid,
    )
    return Boolean(gameFound)
  }

  public addOperatorGamesLimits(operatorGamesLimits: OperatorGameLimitsEntity) {
    // Busca si este operador ya tiene ese juego
    const gameLimit = this.operatorGamesLimits?.find(
      (gameLimit) => gameLimit.game.uuid === operatorGamesLimits.game.uuid,
    )

    // Si no lo tiene agrega el juego con los limites
    if (!gameLimit) {
      this.operatorGamesLimits?.push(operatorGamesLimits)
      return this.operatorGamesLimits
    }

    // Obten el index del juego dentro del array gamesLimits
    const gameLimitFound = this.operatorGamesLimits?.findIndex(
      (gameLimit) => gameLimit.game.uuid === operatorGamesLimits.game.uuid,
    )

    // Valida si ya hay una configuracion con la currency entrante para este juego
    const currencyFound = gameLimit.currencyAndLimits.findIndex(
      (currencyLimit) =>
        currencyLimit.currency.uuid === operatorGamesLimits.currencyAndLimits[0].currency.uuid,
    )
    if (currencyFound !== -1) {
      this.operatorGamesLimits![gameLimitFound!].currencyAndLimits[currencyFound] = {
        ...operatorGamesLimits.currencyAndLimits[0],
      }
      return this.operatorGamesLimits
    }

    // Si el juego no tiene configurado limites para esa currency
    this.operatorGamesLimits![gameLimitFound!].currencyAndLimits.push(
      ...operatorGamesLimits.currencyAndLimits,
    )
    return this.operatorGamesLimits
  }

  public addConfigPaymentByGame(gameUuid: string, configPayment: ConfigPaymentEntity[]) {
    const gameFound = this.getGameInOperator(gameUuid)
    if (!gameFound) return null

    const gameIdx = this.operatorGamesLimits?.findIndex(
      (gameLimit) => gameLimit.game.uuid === gameUuid,
    )
    console.log({ gameIdx })
    this.operatorGamesLimits![gameIdx!].configPayment = configPayment
    const algo = this.operatorGamesLimits![gameIdx!].configPayment
    console.log({ algo })
    return this.operatorGamesLimits
  }
}
