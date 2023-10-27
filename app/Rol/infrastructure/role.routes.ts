import Route from '@ioc:Adonis/Core/Route'
import { roleController } from './dependencies'

const RolRoutes = () => {
  Route.post('/', roleController.createRole).middleware(['validateToken'])
  Route.get('/', roleController.getAllRoles).middleware(['validateToken'])
  Route.delete('/:uuid', roleController.deleteRole).middleware(['validateToken'])
}

export default RolRoutes
