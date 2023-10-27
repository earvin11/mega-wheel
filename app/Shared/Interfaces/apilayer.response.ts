export interface ExchangeCurrency {
  date: string
  info: Info
  query: Query
  result: number
  success: boolean
}

export interface Info {
  rate: number
  timestamp: number
}

export interface Query {
  amount: number
  from: string
  to: string
}
