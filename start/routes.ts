/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuditoriesRoutes from 'App/Auditory/infrastructure/auditory.routes'
import AuthenticationRoutes from 'App/Authentication/infrastructure/authentication.routes'
import ClientRoutes from 'App/Client/infrastructure/client.routes'
import GameRoutes from 'App/Game/infrastructure/game.routes'
import OperatorRoutes from 'App/Operator/infrastructure/operator.routes'
import UserRoutes from 'App/User/infrastructure/user.routes'
import LogRoutes from 'App/Log/infrastructure/log.routes'
import SupportRoutes from '../app/Support/infrastructure/support.routes'
import ExchangeRoutes from 'App/ExchangeApi/infrastructure/exchange.routes'
import CurrencyRoutes from 'App/Currencies/infrastructure/currency.routes'
import CroupierRoute from 'App/Croupiers/infrastructure/croupier.route'
import faqRoutes from 'App/Faqs/infratructure/faq.routes'
import questionRoutes from 'App/questions/infratructure/question.routes'
import RolRoutes from 'App/Rol/infrastructure/role.routes'
import ChipRoutes from 'App/Chip/infrastructure/chip.routes'
import WheelRoutes from 'App/WheelFortune/infraestructure/wheelFortune.routes'

Route.group(AuthenticationRoutes).prefix('auth')
Route.group(AuditoriesRoutes).prefix('auditories')
Route.group(UserRoutes).prefix('user')
Route.group(OperatorRoutes).prefix('operator')
Route.group(CroupierRoute).prefix('croupier')
Route.group(GameRoutes).prefix('game')
Route.group(LogRoutes).prefix('log')
Route.group(ClientRoutes).prefix('client')
Route.group(faqRoutes).prefix('faq')
Route.group(SupportRoutes).prefix('support')
Route.group(ExchangeRoutes).prefix('exchange')
Route.group(CurrencyRoutes).prefix('currency')
Route.group(questionRoutes).prefix('question')
Route.group(RolRoutes).prefix('role')
Route.group(ChipRoutes).prefix('chip')
//GAME
Route.group(WheelRoutes).prefix('wheel')