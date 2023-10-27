import Route from '@ioc:Adonis/Core/Route'
import authenticationController from './dependencies'

const AuthenticationRoutes = () => {
  Route.post('/register', authenticationController.register).middleware('register')
  Route.post('/login', authenticationController.login).middleware('login')
  Route.get('/user/:userName', authenticationController.getUserByUserName)
  Route.get('/user', authenticationController.getUserByToken)
  Route.post('/forgot-password', authenticationController.forgotPassword)
  Route.post('/recover-password', authenticationController.recoverPassword)
}

export default AuthenticationRoutes
