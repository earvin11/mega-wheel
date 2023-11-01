import { socketServerGame } from '../app/Shared/Services/socket-server-game'
// import GameSockets from 'App/Game/infrastructure/game.sockets'
import Logger from '@ioc:Adonis/Core/Logger'
import AdonisServer from '@ioc:Adonis/Core/Server'

// import { blackjackGameController } from 'App/Game/infrastructure/blackjack-game.dependencies'

// socketServerGame.addGroup(GameSockets, { prefix: 'game' })
// socketServerGame.addReservatedListener(
//     'disconnect',
//     blackjackGameController.disconnectPlayer
// )
socketServerGame.start(AdonisServer.instance, {
  onComplete: async ({ channels }) => {
    Logger.info('SOCKET SERVER STARTED')
    for (const channel of channels) Logger.info(`socket - ${channel}`)
  },
  onConnected: () => {
    Logger.info('client is connected!')
  },
})
