import Route from '@ioc:Adonis/Core/Route'
import { wheelFortuneController } from './dependencies'

const WheelRoutes = () => {
  Route.post('/', wheelFortuneController.create)
}

export default WheelRoutes;