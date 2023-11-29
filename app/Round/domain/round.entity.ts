export interface RoundEntity {
  result?: number | null
  open?: boolean
  start_date: Date
  end_date?: Date
  jackpot?: Jackpot
  gameUuid: string
  providerId: string
  identifierNumber: string
  uuid?: string
}

export interface Jackpot {
  number: number
  multiplier: number
}
