import Route from '@ioc:Adonis/Core/Route'
import { logController } from './dependencies'

const LogRoutes = () => {
  Route.get('/', logController.getAllLogs).middleware('validateToken')
}

export default LogRoutes
