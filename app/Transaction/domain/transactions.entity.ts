import { BetEntity } from 'App/Bet/domain'
import { CurrencyEntity } from 'App/Currencies/domain/currency.entity'
import { PlayerEntity } from 'App/Player/domain/player.entity'

export interface TransactionEntity {
  playerIp: string
  playerCountry: string
  platform: string
  userAgent: string
  typeTransaction: TypesTransaction
  amount: number
  amountExchangeDollar: number
  currency?: CurrencyEntity
  userBalance: number
  currencyExchangeDollar: number
  bet?: BetEntity
  player?: PlayerEntity
  round: any
  game: any
  usersOnline?: number
  uuid?: string
}

export enum TypesTransaction {
  credit = 'credit',
  debit = 'debit',
  rollback = 'rollback',
}
