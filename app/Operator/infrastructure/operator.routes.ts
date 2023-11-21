import Route from '@ioc:Adonis/Core/Route'
import operatorController from './dependencies'

const OperatorRoutes = () => {
  Route.post('/create', operatorController.createOperator).middleware([
    // 'validateToken',
    'createOperator',
  ])
  Route.get('/', operatorController.getAllOperators).middleware(['validateToken'])
  Route.put('/:uuid/disable', operatorController.disableOperator).middleware(['validateToken'])
  Route.put('/:uuid/enable', operatorController.enableOperator).middleware(['validateToken'])
  Route.get('/:uuid', operatorController.getOperatorByUuid)//.middleware(['validateToken'])
  Route.delete('/:uuid', operatorController.deleteOperator)//.middleware(['validateToken'])
  Route.put('/:uuid/update-urls', operatorController.updateOperatorUrls).middleware([
    'validateToken',
  ])
  Route.put('/:uuid', operatorController.updateOperator).middleware(['validateToken'])
  Route.get('/client/:clientUuid', operatorController.getOperatorsByClient).middleware([
    'validateToken',
  ])
  // // CHIPS
  // Route.put('/:uuid/assign-chip', operatorController.assignChipsToOperator).middleware([
  //   //'validateToken',
  // ])
  // Route.get('/:uuid/chips', operatorController.showOperatorChips).middleware(['validateToken'])
  // Route.delete('/:uuid/delete-chip/:chipUuid', operatorController.deleteChipInOperator).middleware([
  //   'validateToken',
  // ])

  // Route.post('/:uuid/default-chips/:isoCode',operatorController.addDefaultChips).middleware(['validateToken'])
  // Route.put('/:uuid/update-chip/:chipUuid',operatorController.updateChip).middleware(['validateToken'])
  // CURRENCIES
  Route.put('/:uuid/add-currency', operatorController.addCurrencyToOperator).middleware([
    // 'validateToken',
  ])
  Route.delete('/:uuid/remove-currency/:currency', operatorController.removeCurrencyToOperator).middleware([
    'validateToken',
  ])

  // GAMES AND LIMITS 
  Route.patch('/:uuid/add-game-and-limits', operatorController.addGameLimitsInOperator);
  Route.patch('/:uuid/add-config-payments/:gameUuid',operatorController.addConfigPaymentInGame);
  Route.get('/:uuid/games-by-currency/:currency', operatorController.getGamesByCurrency);
}

export default OperatorRoutes
