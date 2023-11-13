import { BetBody } from 'App/Bet/domain'
import { CurrencyEntity } from 'App/Currencies/domain/currency.entity'

export const calculateAmountBet = (bet: BetBody[]): number => {
    let totalAmount: number = 0
    bet.forEach(betBody => {
        totalAmount += betBody.amount
    });
    return totalAmount
  }
  
  export const exchangeCurrencyByDollar = (currency: CurrencyEntity): number => {
    if (!currency.exchangeRateHistory) return 0
    const lastIndex = currency.exchangeRateHistory.length - 1
    return currency.exchangeRateHistory[lastIndex].price
  }
  
  export const getSecondsOfDiferent = (date: Date) => {
    const dif = date.getTime() - new Date().getTime()
    const secondsOfDiferent = Math.abs(dif / 1000)
    return secondsOfDiferent
  }
  
  export const addHoursToTime = (date: Date, countHours: number): Date => {
    // Obten el numero de milisegundos de la fecha recibida
    const numberOfMlSeconds = date.getTime()
    // la cantidad de horas que quieras operar convierte a milisegundos
    const addMlSeconds = countHours * 60 * 60000
    // realiza la operacion
    const newObjDate = new Date(numberOfMlSeconds + addMlSeconds)
    return newObjDate
  }