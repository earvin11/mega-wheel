import { CurrencyEntity } from '../domain/currency.entity'
import { CurrencyRepository } from '../domain/currency.repository'
import { RateHistory } from '../domain/rateHistory.entity'
import { UpdateCurrencyEntity } from '../domain/updateCurrency.entity'
import CurrencyModel from './currency.model'

export class CurrencyMongoRepository implements CurrencyRepository {
  public createCurrency = async (currency: CurrencyEntity): Promise<CurrencyEntity> => {
    const currencyCreated = await CurrencyModel.create(currency)
    return currencyCreated
  }

  public getAllCurrencies = async (): Promise<CurrencyEntity[] | []> => {
    const currencies = await CurrencyModel.find().exec()
    return currencies
  }

  public getCurrencyByUuid = async (uuid: string): Promise<CurrencyEntity | null> => {
    const currency = await CurrencyModel.findOne({ uuid }).exec()
    if (!currency) return null

    return currency
  }

  public getCurrencyByIsoCode = async (isoCode: string): Promise<CurrencyEntity | null> => {
    const currency = await CurrencyModel.findOne({ isoCode }).exec();
    if(!currency) return null;
    return currency;
  }

  public deleteCurrency = async (uuid: string): Promise<CurrencyEntity | null> => {
    const currency = await CurrencyModel.findOneAndUpdate(
      { uuid },
      { status: false },
      { new: true }
    ).exec()
    if (!currency) return null

    return currency
  }

  public updateCurrency = async (
    uuid: string,
    dataToUpdate: UpdateCurrencyEntity
  ): Promise<CurrencyEntity | null> => {
    const currency = await CurrencyModel.findOneAndUpdate({ uuid }, dataToUpdate, {
      new: true,
    }).exec()
    if (!currency) return null

    return currency
  }

  public getCurrenciesRateHistory = this.getAllCurrencies

  public updateAllCurrenciesRate = async (
    isoCode: string,
    rate: RateHistory
  ): Promise<CurrencyEntity | null> => {
    const currency = await CurrencyModel.findOneAndUpdate(
      { isoCode },
      {
        usdRateChange: rate.price,
        $push: {
          exchangeRateHistory: {
            $each: [rate],
            $position: 0,
          },
        },
      },
      {
        new: true,
      }
    ).exec()
    if (!currency) return null

    return currency
  }
}
