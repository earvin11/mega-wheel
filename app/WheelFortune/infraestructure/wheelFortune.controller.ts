import { HttpContext } from "@adonisjs/core/build/standalone";
import { WheelFortuneUseCases } from "../apllication/wheel-fortune.use-cases";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server } from "socket.io";
import { sleep } from "App/Shared/Helpers/sleep";
import { Phase } from "App/Game/domain/types/phase.interfaces";
import { CHANGE_PHASE_EVENT } from "./constants";
import { WheelFortuneControlRedisUseCases } from "../apllication/wheel-fortune.redis.use-cases";

export class WheelFortuneController {
  constructor(
    private wheelUseCases: WheelFortuneUseCases,
    private wheelControlRedisUseCases: WheelFortuneControlRedisUseCases
  ) { }

  public changePhase = async (
    table: string,
    phase: Phase,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    timeWait?: number
  ) => {
    // const players =
    //   await this.gameControlUseCase.getEnablePlayersWithOutOptions()
    // const countPlayers = players.length

    await this.wheelControlRedisUseCases.toPhase(table, phase)
    // Logger.info(`change phase: ${phase}`)
    io.emit(CHANGE_PHASE_EVENT, {
      phase: await this.wheelControlRedisUseCases.getPhase(table),
      timeWait,
      // countPlayers,
    })
    if (timeWait) await sleep(timeWait)
  }

  public create = async ({ request, response }: HttpContext) => {
    try {
      const {
        name,
        betTime,
        colorBackground,
        croupier,
        imgBackgrout,
        jackpot,
        language,
        logo,
        providerId,
        urlTransmision
      } = request.body();


      const newWheel = await this.wheelUseCases.create({
        name,
        betTime,
        colorBackground,
        croupier,
        imgBackgrout,
        jackpot,
        language,
        logo,
        providerId,
        urlTransmision
      });

      response.created(newWheel);
    } catch (error) {
      response.internalServerError({ error: 'Talk to administrator' });
    }
  }
};