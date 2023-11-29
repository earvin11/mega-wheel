export interface BetEntity {
  bet: BetBody[]
  uuid?: string
  gameUuid: string
  playerUuid: string
  roundUuid: string
  isPaid?: boolean
  totalAmount: number
  currencyUuid: string
  currencyIsoCode: string
  createdAt?: string
  _id?: string
}

export interface BetBody {
  number: number
  amount: number
}
