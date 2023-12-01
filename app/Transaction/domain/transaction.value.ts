import { GenerateId } from 'App/Shared/Helpers/generate-id.helpers'
import { TransactionEntity, TypesTransaction } from 'App/Transaction/domain/transactions.entity'

export class Transaction implements TransactionEntity {
  public playerIp: string
  public playerCountry: string
  public platform: string
  public userAgent: string
  public typeTransaction: TypesTransaction
  public amount: number
  public amountExchangeDollar: number
  public currency
  public userBalance: number
  public currencyExchangeDollar: number
  public bet
  public player
  public round: string
  public game: string
  public usersOnline: number | undefined
  public uuid?: string

  constructor(transaction: TransactionEntity) {
    this.playerIp = transaction.playerIp
    this.playerCountry = transaction.playerCountry
    this.platform = transaction.platform
    this.userAgent = transaction.userAgent
    this.typeTransaction = transaction.typeTransaction
    this.amount = transaction.amount
    this.amountExchangeDollar = transaction.amountExchangeDollar
    this.currency = transaction.currency
    this.userBalance = transaction.userBalance
    this.currencyExchangeDollar = transaction.currencyExchangeDollar
    this.bet = transaction.bet
    this.player = transaction.player
    this.round = transaction.round
    this.game = transaction.game
    this.usersOnline = transaction.usersOnline
    this.uuid = new GenerateId().uuid
  }
}
