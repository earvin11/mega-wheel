import Route from '@ioc:Adonis/Core/Route'
import { roundController } from './dependencies'

const RoundRoutes = () => {
  Route.post('/', roundController.createRound)
  Route.post('/update', roundController.updateRound)

  Route.patch('/result', roundController.result)//.middleware(['validateToken'])
}

export default RoundRoutes
