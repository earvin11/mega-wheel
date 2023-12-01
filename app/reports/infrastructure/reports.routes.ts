import Route from '@ioc:Adonis/Core/Route'
import { reportsController } from './dependencies'

const ReportsRoutes = () => {
  Route.get('rounds', reportsController.getRounds).middleware(['pagination'])
  Route.get('transactions', reportsController.getTransactions).middleware(['pagination'])
  // Route.get('bet/:uuid', reportsController.getBetInTransaction)
  // Route.get('currency-fluctuation', reportsController.getCurrencyFluctuation).middleware([
  //   'pagination',
  // ])
  // Route.get('ggr-by-casino', reportsController.getGgrByCasino).middleware(['pagination'])
  // Route.get('visits', reportsController.getVisits)
  // Route.get('bets-by-round', reportsController.betsByRound)
}

export default ReportsRoutes
