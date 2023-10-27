import { CurrencyEntity } from '../domain/currency.entity'
import { CurrencyRepository } from '../domain/currency.repository'
import { Currency } from '../domain/currency.value'
import { RateHistory } from '../domain/rateHistory.entity'
import { UpdateCurrencyEntity } from '../domain/updateCurrency.entity'

export class CurrencyUseCases {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  public createCurrency = async (currency: CurrencyEntity) => {
    const newCurrency = new Currency(currency)
    const currencyCreated = await this.currencyRepository.createCurrency(newCurrency)
    return currencyCreated
  }

  public getAllCurrencies = async () => {
    const currencies = await this.currencyRepository.getAllCurrencies()
    return currencies
  }

  public getCurrencyByUuid = async (uuid: string) => {
    const currency = await this.currencyRepository.getCurrencyByUuid(uuid)
    return currency
  }

  public getCurrencyByIsoCode = async(isoCode: string) => {
    const currency =  await this.currencyRepository.getCurrencyByIsoCode(isoCode);
    return currency;
  }

  public deleteCurrency = async (uuid: string) => {
    const currency = await this.currencyRepository.deleteCurrency(uuid)
    return currency
  }

  public updateCurrency = async (uuid: string, dataToUpdate: UpdateCurrencyEntity) => {
    const currency = await this.currencyRepository.updateCurrency(uuid, dataToUpdate)
    return currency
  }

  public getCurrenciesRateHistory = this.getAllCurrencies

  public updateAllCurrenciesRate = async (isoCode: string, rate: RateHistory) => {
    const currency = await this.currencyRepository.updateAllCurrenciesRate(isoCode, rate)
    return currency
  }
}
