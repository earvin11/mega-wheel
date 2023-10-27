import { CurrencyEntity } from './currency.entity'
import { RateHistory } from './rateHistory.entity'
import { UpdateCurrencyEntity } from './updateCurrency.entity'

export interface CurrencyRepository {
  createCurrency(currency: CurrencyEntity): Promise<CurrencyEntity>
  getAllCurrencies(): Promise<CurrencyEntity[] | []>
  getCurrencyByUuid(uuid: string): Promise<CurrencyEntity | null>
  getCurrencyByIsoCode( short: string ): Promise<CurrencyEntity | null>
  deleteCurrency(uuid: string): Promise<CurrencyEntity | null>
  updateCurrency(uuid: string, dataToUpdate: UpdateCurrencyEntity): Promise<CurrencyEntity | null>
  getCurrenciesRateHistory(): Promise<CurrencyEntity[] | null>
  updateAllCurrenciesRate(isoCode: string, rate: RateHistory): Promise<CurrencyEntity | null>
}
