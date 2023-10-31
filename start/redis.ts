/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Redis from '@ioc:Adonis/Addons/Redis'
import { END_GAME_PUB_SUB, START_GAME_PUB_SUB } from 'App/WheelFortune/infraestructure/constants'
import Logger from '@ioc:Adonis/Core/Logger'

Redis.subscribe(START_GAME_PUB_SUB, async () => {
  Logger.info('INICIAR MEGA WHEEL')
})

Redis.subscribe(END_GAME_PUB_SUB, async () => {
  Logger.info('FIN DE JUEGO')
})

