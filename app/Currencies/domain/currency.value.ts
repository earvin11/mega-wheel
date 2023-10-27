import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'
import { CurrencyEntity } from './currency.entity'
import { RateHistory } from './rateHistory.entity'

export class Currency implements CurrencyEntity {
  public isoCode: string
  public name: string
  public usdRateChange: number
  public exchangeRateHistory: RateHistory[]
  public status: boolean
  public uuid: string

  constructor(currency: CurrencyEntity) {
    const { uuid } = new GenerateId()
    this.isoCode = currency.isoCode
    this.name = currency.name
    this.usdRateChange = currency.usdRateChange
    this.uuid = uuid
    this.status = true
    this.exchangeRateHistory = [
      {
        price: currency.usdRateChange,
        date: new Date(),
      },
    ]
  }
}
