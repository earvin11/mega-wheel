import { HttpContext } from '@adonisjs/core/build/standalone'
import { CurrencyUseCases } from '../application/currencyUseCases'
import { CurrencyEntity } from '../domain/currency.entity'
import { UpdateCurrencyEntity } from '../domain/updateCurrency.entity'
import { getCurrencyRates } from '../../Shared/Helpers/currency-rates'
import { RateHistory } from '../domain/rateHistory.entity'
import { validateIsoCode } from '../../Shared/Helpers/validateIsoCode'

export class CurrencyController {
  constructor(private currencyUseCases: CurrencyUseCases) {}

  public createCurrency = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { isoCode, name } = request.body()

    const existIsoCode = validateIsoCode(isoCode)
    if (!existIsoCode)
      return response.status(404).json({ error: 'Debe introducir un isoCode válido!' })

    const currencyRate = await getCurrencyRates(existIsoCode)
    if (!currencyRate)
      return response
        .status(404)
        .json({ error: 'No se pudo obtener la taza de cambio. Inténtelo en otro momento!' })

    const usdRateChange = currencyRate.result

    const currency: CurrencyEntity = {
      isoCode: existIsoCode,
      name,
      usdRateChange,
    }
    try {
      const currencyCreated = await this.currencyUseCases.createCurrency(currency)
      return response.status(201).json({ message: 'Moneda creada!', currency: currencyCreated })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo crear la nueva moneda!', error })
    }
  }

  public getAllCurrencies = async ({ response }: HttpContext) => {
    try {
      const currencies = await this.currencyUseCases.getAllCurrencies()
      if (currencies.length === 0)
        return response.status(404).json({ error: 'No se encontraron monedas listadas!' })

      return response.status(200).json({ message: 'Monedas listadas!', currencies })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudieron obtener la monedas!', error })
    }
  }

  public getCurrencyByUuid = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const currency = await this.currencyUseCases.getCurrencyByUuid(uuid)
      if (!currency) return response.status(404).json({ error: 'No se encuentra la moneda!' })

      return response.status(200).json({ message: 'Moneda listada!', currency })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudieron obtener la moneda!', error })
    }
  }

  public deleteCurrency = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const currency = await this.currencyUseCases.deleteCurrency(uuid)
      if (!currency) return response.status(404).json({ error: 'No se encuentra la moneda!' })

      return response.status(200).json({ message: 'Moneda eliminada!', currency })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo eliminar la moneda!', error })
    }
  }

  public updateCurrency = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()
    const { isoCode, name, status } = request.body()

    if (!isoCode && !name)
      return response
        .status(401)
        .json({ error: 'Debe enviar el isoCode o el name de la moneda que quiere actualizar!' })

    if (isoCode) {
      const existIsoCode = validateIsoCode(isoCode)
      if (!existIsoCode)
        return response.status(404).json({ error: 'Debe introducir un isoCode válido!' })
    }

    const dataToUpdate: UpdateCurrencyEntity = {
      isoCode,
      name,
      status,
    }

    try {
      const currency = await this.currencyUseCases.updateCurrency(uuid, dataToUpdate)
      if (!currency) return response.status(404).json({ error: 'No se encuentra la moneda!' })

      return response.status(200).json({ message: 'Moneda actualizada!', currency })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo actualizar la moneda!', error })
    }
  }

  public getCurrenciesRateHistory = async ({ response }: HttpContext) => {
    try {
      const currencies = await this.currencyUseCases.getCurrenciesRateHistory()
      if (currencies.length === 0)
        return response.status(404).json({ error: 'No se encontraron monedas listadas!' })

      const currenciesRateHistory = currencies.map((currency: CurrencyEntity) => {
        return { currency: currency.isoCode, history: currency['exchangeRateHistory'] }
      })

      return response.status(200).json({
        message: 'Historial de tazas de cambio de las monedas listado!',
        rates: currenciesRateHistory,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'No se pudo obtener el historial de tazas de cambio de las monedas!',
        error,
      })
    }
  }

  // * Usamos esta función para crear el worker que actualiza las tazas de cambio de las monedas cada día.
  public currencyRatesUpdater = async (currencies: CurrencyEntity[]): Promise<void> => {
    currencies.forEach(async (currency: CurrencyEntity) => {
      const { isoCode } = currency
      const date = new Date()

      const priceCurrency = await getCurrencyRates(isoCode)
      const rate: RateHistory = {
        date,
        price: priceCurrency ? priceCurrency.result : currency.usdRateChange,
      }

      await this.currencyUseCases.updateAllCurrenciesRate(isoCode, rate)
    })
  }

  public updateAllCurrenciesRate = async ({ response }: HttpContext) => {
    try {
      const currencies = await this.currencyUseCases.getAllCurrencies()
      if (currencies.length === 0)
        return response.status(404).json({ error: 'No se encontraron monedas listadas!' })

      await this.currencyRatesUpdater(currencies)

      return response.status(200).json({
        message: 'Todas las tazas de cambio fueron actualizadas!',
      })
    } catch (error) {
      return response.status(400).json({
        message: 'No se pudieron actualizar todas las tazas de cambio de las monedas!',
        error,
      })
    }
  }
}
