import Route from '@ioc:Adonis/Core/Route'
import { currencyController } from './dependencies'

const CurrencyRoutes = () => {
  Route.post('/', currencyController.createCurrency).middleware([
    // 'validateToken',
    'createCurrency',
  ])
  Route.get('/', currencyController.getAllCurrencies).middleware(['validateToken'])
  Route.get('/rate-history', currencyController.getCurrenciesRateHistory).middleware([
    'validateToken',
  ])
  Route.get('/:uuid', currencyController.getCurrencyByUuid).middleware(['validateToken'])
  Route.delete('/:uuid', currencyController.deleteCurrency).middleware(['validateToken'])
  Route.put('/update/rates', currencyController.updateAllCurrenciesRate).middleware(['validateToken'])
  Route.put('/:uuid', currencyController.updateCurrency).middleware(['validateToken'])
}

export default CurrencyRoutes
