import Route from '@ioc:Adonis/Core/Route'
import userController from './dependencies'

const UserRoutes = () => {
  Route.post('/', userController.createUser).middleware(['validateToken', 'createUser'])
  Route.get('/', userController.getAllUsers)
  Route.get('/:uuid', userController.getUserById)
  Route.put('/update', userController.updateUser).middleware('validateToken')
  Route.delete('/:uuid', userController.deleteUser)
  Route.put('/update-password', userController.updatePassword).middleware('validateToken')
  Route.get('/client/:clientUuid', userController.getUsersByClient).middleware(['validateToken'])
}

export default UserRoutes
