import Route from '@ioc:Adonis/Core/Route'
import { wheelFortuneController } from './dependencies'

const WheelRoutes = () => {
  Route.post('/', wheelFortuneController.create).middleware(['createWheel'])
  Route.patch('/:uuid', wheelFortuneController.updateGame)
  Route.delete('/:uuid', wheelFortuneController.deleteGame)
}

export default WheelRoutes;