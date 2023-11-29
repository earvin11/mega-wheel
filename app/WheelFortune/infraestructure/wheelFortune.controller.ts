import { HttpContext } from "@adonisjs/core/build/standalone";
import { WheelFortuneUseCases } from "../apllication/wheel-fortune.use-cases";

export class WheelFortuneController {
  constructor(
    private wheelUseCases: WheelFortuneUseCases,
  ) { }

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
        urlTransmision,
        launchUrl,
        percentReturnToPlayer,
        betOptions,
        betPays,
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
        urlTransmision,
        launchUrl,
        percentReturnToPlayer,
        betOptions,
        betPays,
      });

      response.created(newWheel);
    } catch (error) {
      response.internalServerError({ error: 'Talk to administrator' });
    }
  }

};