import { betController } from './dependencies'
import Route from '@ioc:Adonis/Core/Route'

const BetRoutes = () => {
  Route.post('/', betController.createBet)
  //   Route.get('/winner', betController.getWinner)
  //   Route.post('/jackpot', betController.jackpotWinners)
}

export default BetRoutes
