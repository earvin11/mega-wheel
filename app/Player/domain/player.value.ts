import { OperatorEntity } from "../../Operator/domain/entities"
import { PlayerEntity } from "./player.entity"
import { GenerateId } from "../../Shared/Helpers/generate-id.helpers"

export class Player implements PlayerEntity {
    public userId: string
    public username: string
    public uuid: string
    public operator: OperatorEntity
    public currencyUuid: string
    public lastBalance: number
    public status: boolean
    public isAdmin: boolean
    public tokenWallet: string
    public WL: string
  
    constructor(player: PlayerEntity) {
      const { uuid } = new GenerateId()
      this.userId = player.userId
      this.username = player.username
      this.uuid = uuid
      this.operator = player.operator
      this.currencyUuid = player.currencyUuid
      this.lastBalance = player.lastBalance
      this.status = true
      this.isAdmin = false
      this.tokenWallet = player.tokenWallet
      this.WL = player.WL || ''
    }
  }