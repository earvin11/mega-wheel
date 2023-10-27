import Route from '@ioc:Adonis/Core/Route'
import { clientController } from './dependencies'

const ClientRoutes = () => {
  Route.post('/', clientController.createClient).middleware([/*'validateToken',*/ 'createClient'])
  Route.get('/', clientController.getAllClients).middleware(['validateToken'])
  Route.get('/:uuid', clientController.getClientByUuid).middleware(['validateToken'])
  Route.put('/:uuid', clientController.updateClient).middleware(['validateToken'])
  Route.delete('/remove/:uuid', clientController.deleteClient).middleware(['validateToken'])
  Route.put('/disable', clientController.disableClient).middleware(['validateToken'])
  Route.put('/enable', clientController.enableClient).middleware(['validateToken'])
  Route.put('/:uuid/add-game', clientController.addGameToClient)//.middleware(['validateToken'])
  Route.get('/:uuid/all-games', clientController.getAllGamesInClient).middleware(['validateToken'])
  Route.get('/:uuid/available-games', clientController.getAvailableGamesInClient).middleware([
    'validateToken',
  ])
  Route.get('/game/:gameUuid', clientController.getClientsByGame).middleware(['validateToken'])
  Route.put('/:uuid/add-currency', clientController.addCurrencyToClient).middleware([
    'validateToken',
  ])
  Route.delete('/:uuid/remove-currency/:currency', clientController.removeCurrencyToClient).middleware([
    'validateToken',
  ])
  Route.delete('/:uuid/game/:gameUuid', clientController.deleteGame).middleware(['validateToken']);
}

export default ClientRoutes
