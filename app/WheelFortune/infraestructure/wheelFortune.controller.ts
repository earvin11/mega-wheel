import { HttpContext } from '@adonisjs/core/build/standalone'
import { WheelFortuneUseCases } from '../apllication/wheel-fortune.use-cases'
import { UpdateWheelDto } from '../domain/wheel-fortune.entity'

export class WheelFortuneController {
  constructor(private wheelUseCases: WheelFortuneUseCases) { }

  public create = async ({ request, response }: HttpContext) => {
    try {
      const {
        name,
        betTime,
        colorBackground,
        croupier,
        imgBackground,
        jackpot,
        language,
        logo,
        providerId,
        urlTransmision,
        launchUrl,
        percentReturnToPlayer,
        betPays,
      } = request.body()

      const newWheel = await this.wheelUseCases.create({
        name,
        betTime,
        colorBackground,
        croupier,
        imgBackground,
        jackpot,
        language,
        logo,
        providerId,
        urlTransmision,
        launchUrl,
        percentReturnToPlayer,
        betPays,
      })

      response.created(newWheel)
    } catch (error) {
      response.internalServerError({ error: 'Talk to administrator' })
    }
  }

  public updateGame = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { name, providerId, imgBackground, urlTransmision, logo, betPays, betTime, launchUrl } =
      request.body()

    if (!providerId && !imgBackground && !urlTransmision && !name && !logo && !betPays && !betTime && !launchUrl)
      return response.status(401).json({ error: 'Debe enviar los campos requeridos!' })

    const dataToUpdate: UpdateWheelDto = {
      providerId,
      imgBackground,
      urlTransmision,
      name,
      logo,
      betPays,
      betTime,
      launchUrl,
    }

    try {
      const game = await this.wheelUseCases.updateByUuid(uuid, dataToUpdate)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      return response.status(200).json({ message: 'Juego actualizado!', game })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo actualizar el juego!', error })
    }
  }

  public deleteGame = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.body()

    if (!uuid) return response.status(401).json({ error: 'Debe enviar el uuid del juego!' })

    try {
      const game = await this.wheelUseCases.deleteByUuid(uuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      return response.status(200).json({ message: 'Juego eliminado!', game })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo eliminar el juego!', error })
    }
  }
}
