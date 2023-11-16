import Route from '@ioc:Adonis/Core/Route'
import { launchController } from './dependencies';

const LaunchRoutes = () => {
  Route.post('/', launchController.launch).middleware([])
}

export default LaunchRoutes
