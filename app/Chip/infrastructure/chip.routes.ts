import Route from '@ioc:Adonis/Core/Route'
import { chipController } from './dependencies'

const ChipRoutes = () => {
  Route.post('/', chipController.createChip).middleware([/*'validateToken',*/ 'createChip'])
  Route.get('/', chipController.getAllChips).middleware(['validateToken'])
  Route.post('/default-chips', chipController.addDefaultChips)
}

export default ChipRoutes
