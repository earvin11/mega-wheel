import { AxiosAdapter } from '../Adapters/axios.adapter'
import { ExchangeCurrency } from '../Interfaces/apilayer.response'
import { BluelyticsResponse } from '../Interfaces/bluelytics.response'

export const getCurrencyRates = async (isoCode: string): Promise<ExchangeCurrency | null> => {
  try {
    const url = `https://api.apilayer.com/exchangerates_data/convert?to=USD&from=${isoCode}&amount=1`
    const headers = {
      apiKey: <string>process.env.CURRENCIES_RATES_API_KEY,
    }

    const request = new AxiosAdapter(url)
    const response = await request.get(headers)

    return response.data
  } catch (error) {
    console.log('ERROR GET CURRENCY RATES -> CURRENCY RATES',error);
    
    return null
  }
}

export const getArsRates = async (): Promise<BluelyticsResponse | null> => {
  try {
    const url = 'https://api.bluelytics.com.ar/v2/latest'

    const request = new AxiosAdapter(url)
    const response = await request.get()

    return response.data
  } catch (error) {
    return null
  }
}
