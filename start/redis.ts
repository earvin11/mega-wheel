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
import { roundUseCases } from 'App/Round/infraestructure/dependencies';
import { wheelFortuneController, wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies';
import { sleep } from 'App/Shared/Helpers/sleep';
import { socketServerGame } from 'App/Shared/Services/socket-server-game';

Redis.subscribe(START_GAME_PUB_SUB, async () => {
  Logger.info('INICIAR MEGA WHEEL');
  // VERIFICAR QUE HAYA ALGUN JUEGO ABIERTO
  // ABRIR JUEGO
  // CONTROLLER START
  const round = await roundUseCases.createRound({ gameUuid: 'asdas', identifierNumber: '1-1', providerId: 'm1', start_date: new Date() })

  wheelFortuneController.changePhase('m1', 'initial_bet', socketServerGame.io)

  Redis.set(`round:${round.uuid}`, JSON.stringify(round));

  const game = await wheelFortuneUseCases.getByUuid('89cc5c2c-b2ae-4694-92a3-b77bb2d42e09');

  const betTime = game?.betTime as number;

  console.log('before bet time', performance.now())

  await sleep(betTime);
  console.log('after bet time', performance.now())

  roundUseCases.closeBetsIndRound(round.uuid!)
})

Redis.subscribe(END_GAME_PUB_SUB, async (round) => {
  Redis.del(`round:${round}`)
  Logger.info('FIN DE JUEGO')
  Redis.publish(START_GAME_PUB_SUB, '')
})

