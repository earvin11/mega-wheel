import Logger from '@ioc:Adonis/Core/Logger'
import { socketClientCroupier } from "App/Shared/Services/socket-client-croupier";
import { START_GAME_PUB_SUB } from './contants';
import Redis from '@ioc:Adonis/Addons/Redis';


socketClientCroupier.socket.on('connect', async () => {
  Logger.info('croupier.socket - connect')
  await Redis.publish(START_GAME_PUB_SUB, '')
})

socketClientCroupier.socket.on('error', (error) => {
  Logger.error(`croupier.socket - error - ${error.message}`)
})

socketClientCroupier.socket.on('connect_error', (error) => {
  Logger.error(`croupier.socket - connect_error - ${error.message}`)
})
