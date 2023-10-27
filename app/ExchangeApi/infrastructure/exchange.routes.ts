import Route from '@ioc:Adonis/Core/Route'
import { exchangeController } from './dependencies'

const ExchangeRoutes = () => {
  Route.post('/', exchangeController.createExchange).middleware(['validateToken'])
  Route.get('/', exchangeController.getAllExchanges).middleware(['validateToken'])
  Route.get('/:uuid', exchangeController.getExchangeByUuid).middleware(['validateToken'])
  Route.put('/:uuid/disable', exchangeController.disableExchange).middleware(['validateToken'])
  Route.put('/:uuid/enable', exchangeController.enableExchange).middleware(['validateToken'])
  Route.put('/:uuid', exchangeController.updateExchange).middleware(['validateToken'])
}

export default ExchangeRoutes
