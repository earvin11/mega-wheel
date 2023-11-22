import { RateHistory } from './rateHistory.entity'

export interface CurrencyEntity {
  name: string
  isoCode: string
  usdRateChange: number
  exchangeRateHistory?: RateHistory[]
  status?: boolean
  uuid?: string
}
