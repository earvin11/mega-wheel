import { GameUseCases } from '../application/GameUseCases'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { GameEntity } from '../domain/game.entity'
import { CreateAuditoryParams } from '../../Shared/Interfaces/create-auditory.interface'
import CreateAuditory from '../../Shared/Helpers/create-auditory'
import { operatorUseCases } from '../../Operator/infrastructure/dependencies'
import { UpdateGameEntity } from '../domain/updateGame.entity'
import { GameLimits } from '../domain/limits.entity'

export class GameController {
  constructor(private gameUseCases: GameUseCases) {}

  public createGame = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { maxBet, minBet, name, providerId, operator } = request.body()

    const game: GameEntity = {
      maxBet,
      minBet,
      name,
      providerId,
      operator,
    }

    try {
      const operatorExist = await operatorUseCases.getOperatorByUuid(operator)
      if (!operatorExist)
        return response.status(404).json({ error: 'No se encuentra el operador!' })

      const gameCreated = await this.gameUseCases.createGame(game)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Crear juego!',
        ctx,
        resource: game.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(201).json({ message: 'Juego creado!', game: gameCreated })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo crear el juego!', error })
    }
  }

  public getGameByUuid = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const game = await this.gameUseCases.getGameByUuid(uuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      return response.status(200).json({ message: 'Juego listado!', game })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo realizar la búsqueda!', error })
    }
  }

  public getAllGames = async ({ response }: HttpContext) => {
    try {
      const games = await this.gameUseCases.getAllGames()
      if (games.length === 0)
        return response.status(404).json({ error: 'No existen juegos listados!' })

      return response.status(200).json({ message: 'Juegos listados!', games })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo realizar la consulta!', error })
    }
  }

  public updateGame = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { name, providerId } = request.body()

    if (!name && !providerId)
      return response.status(401).json({ error: 'Debe enviar los campos requeridos!' })

    const dataToUpdate: UpdateGameEntity = {
      name,
      providerId,
    }

    try {
      const game = await this.gameUseCases.updateGame(uuid, dataToUpdate)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Actualizar juego!',
        ctx,
        resource: game.name,
      }
      await CreateAuditory(auditoryParams)

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
      const game = await this.gameUseCases.deleteGame(uuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Eliminar juego!',
        ctx,
        resource: game.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Juego eliminado!', game })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo eliminar el juego!', error })
    }
  }

  public addOperatorToGame = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { operatorUuid } = request.body()

    if (!operatorUuid)
      return response.status(401).json({ error: 'Debe enviar el id del operador!' })

    try {
      const operator = await operatorUseCases.getOperatorByUuid(operatorUuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      const operatorExistsInAnotherGame = await this.gameUseCases.getGameByOperator(operatorUuid)
      if (operatorExistsInAnotherGame)
        return response.status(400).json({ error: 'El operador ya fue asignado a un juego!' })

      const game = await this.gameUseCases.addOperatorToGame(uuid, operatorUuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Agregar operador al juego!',
        ctx,
        resource: game.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Operador agregado el juego!', game })
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Ha ocurrido un error. No se pudo agregar el operador al juego!', error })
    }
  }

  public getGameByOperator = async ({ request, response }: HttpContext) => {
    const { operatorUuid } = request.params()

    try {
      const operator = await operatorUseCases.getOperatorByUuid(operatorUuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      const game = await this.gameUseCases.getGameByOperator(operatorUuid)
      if (!game)
        return response.status(404).json({ error: 'Este operador no tiene juegos asociados!' })

      return response.status(200).json({ message: 'Juego listado!', game })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo realizar la consulta!', error })
    }
  }

  public updateOperatorInGame = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { operatorUuid } = request.body()

    if (!operatorUuid)
      return response.status(401).json({ error: 'Debe enviar el id del operador!' })

    try {
      const operator = await operatorUseCases.getOperatorByUuid(operatorUuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      const game = await this.gameUseCases.updateOperatorInGame(uuid, operatorUuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      const operatorExistsInAnotherGame = await this.gameUseCases.getGameByOperator(operatorUuid)
      if (operatorExistsInAnotherGame && operatorExistsInAnotherGame.uuid !== uuid) {
        await this.gameUseCases.addOperatorToGame(<string>operatorExistsInAnotherGame.uuid, '')
      }

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Cambiando operador de juego!',
        ctx,
        resource: game.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Operador actualizado en el juego!', game })
    } catch (error) {
      return response.status(400).json({
        message: 'Ha ocurrido un error. No se pudo actualizar el operador en el juego!',
        error,
      })
    }
  }

  public addCroupierToGame = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { croupierUuid } = request.body()

    if (!croupierUuid)
      return response.status(401).json({ error: 'Debe enviar el id del croupier!' })

    try {
      // !Nota: Validar que el croupier exista una vez se cree el módulo del croupier.

      const game = await this.gameUseCases.addCroupierToGame(uuid, croupierUuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Agregar croupier al juego!',
        ctx,
        resource: game.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Croupier agregado el juego!', game })
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Ha ocurrido un error. No se pudo agregar el croupier al juego!', error })
    }
  }

  public changeGameLimit = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()
    const { minBet, maxBet } = request.body()
    const { uuid: operator } = ctx['user']

    if (!minBet && !maxBet)
      return response.status(400).json({ error: 'Debe enviar los límites que desea actualizar!' })

    const limits: GameLimits = {
      maxBet,
      minBet,
    }

    try {
      const gameExist = await this.gameUseCases.getGameByUuid(uuid)
      if (!gameExist) return response.status(404).json({ error: 'No se encuentra el juego!' })

      if (gameExist.operator !== operator)
        return response.status(401).json({ error: 'El juego seleccionado no es de su propiedad!' })

      const game = await this.gameUseCases.changeGameLimits(uuid, limits)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Cambio de límites del juego!',
        ctx,
        resource: game?.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Límites del juego actualizados!', game })
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'No se pudieron actualizar los límites del juego!', error })
    }
  }
}
