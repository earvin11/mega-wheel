/*
|--------------------------------------------------------------------------
| Application middleware
|--------------------------------------------------------------------------
|
| This file is used to define middleware for HTTP requests. You can register
| middleware as a `closure` or an IoC container binding. The bindings are
| preferred, since they keep this file clean.
|
*/

import Server from '@ioc:Adonis/Core/Server'

/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| An array of global middleware, that will be executed in the order they
| are defined for every HTTP requests.
|
*/
Server.middleware.register([() => import('@ioc:Adonis/Core/BodyParser')])

/*
|--------------------------------------------------------------------------
| Named middleware
|--------------------------------------------------------------------------
|
| Named middleware are defined as key-value pair. The value is the namespace
| or middleware function and key is the alias. Later you can use these
| alias on individual routes. For example:
|
| { auth: () => import('App/Middleware/Auth') }
|
| and then use it as follows
|
| Route.get('dashboard', 'UserController.dashboard').middleware('auth')
|
*/
Server.middleware.registerNamed({
  register: () => import('../app/Authentication/infrastructure/register.middleware'),
  login: () => import('../app/Authentication/infrastructure/login.middleware'),
  validateToken: () => import('../app/Shared/Middlewares/validate-token'),
  createOperator: () => import('../app/Operator/infrastructure/createOperator.middleware'),
  createCroupier: () => import('App/Croupiers/infrastructure/createCroupier.middleware'),
  createWheel: () => import('../app/WheelFortune/infraestructure/middlewares/create-wheel.middleware'),
  createClient: () => import('../app/Client/infrastructure/createClient.middleware'),
  createUser: () => import('../app/User/infrastructure/createUser.middleware'),
  createFaq: () => import('App/Faqs/infratructure/createFaq.middleware'),
  createSupportTicket: () =>
    import('../app/Support/infrastructure/createSupportTicket.middleaware'),
  createCurrency: () => import('../app/Currencies/infrastructure/createCurrency.middleware'),
  createQuestion: () => import('App/questions/infratructure/createQuestion.middleware'),
  createChip: () => import('../app/Chip/infrastructure/createChip.middleware'),
  addPaymentsToOperator: () => import('../app/Operator/infrastructure/addPayments.middleware'),
  verifyOperatorGame: () => import('../app/Operator/infrastructure/verifyOperatorGame.middleware'),
})
