export interface BluelyticsResponse {
  oficial: Blue
  blue: Blue
  oficial_euro: Blue
  blue_euro: Blue
  last_update: string
}

export interface Blue {
  value_avg: number
  value_sell: number
  value_buy: number
}
