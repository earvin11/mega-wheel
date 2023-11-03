import Route from '@ioc:Adonis/Core/Route'
import { gameController } from './dependencies'

const GameRoutes = () => {
  Route.post('/create', gameController.createGame).middleware(['validateToken'])
  Route.get('/get-one/:uuid', gameController.getGameByUuid).middleware(['validateToken'])
  Route.get('/all', gameController.getAllGames).middleware(['validateToken'])
  Route.put('/update/:uuid', gameController.updateGame).middleware(['validateToken'])
  Route.delete('/remove', gameController.deleteGame).middleware(['validateToken'])
  Route.put('/add-operator/:uuid', gameController.addOperatorToGame).middleware(['validateToken'])
  Route.get('/operator/:operatorUuid', gameController.getGameByOperator).middleware([
    'validateToken',
  ])
  Route.put('/update-operator/:uuid', gameController.updateOperatorInGame).middleware([
    'validateToken',
  ])
  Route.put('/add-croupier/:uuid', gameController.addCroupierToGame).middleware(['validateToken'])
  Route.put('/change-limits/:uuid', gameController.changeGameLimit).middleware(['validateToken'])
}

export default GameRoutes
