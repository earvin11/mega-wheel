import { ClientUseCases } from '../application/ClientUseCases'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { ClientEntity, UpdateClientEntity } from '../domain/client.entity'
import { CreateAuditoryParams } from '../../Shared/Interfaces/create-auditory.interface'
import CreateAuditory from '../../Shared/Helpers/create-auditory'
import { gameUseCases } from '../../Game/infrastructure/dependencies'

export class ClientController {
  constructor(private clientUseCases: ClientUseCases) { }

  public createClient = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { endpointAuth, endpointBet, endpointRollback, endpointWin, name } = request.body()

    const client: ClientEntity = {
      endpointAuth,
      endpointBet,
      endpointRollback,
      endpointWin,
      name,
    }

    try {
      const clientCreated = await this.clientUseCases.createClient(client)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Crear cliente!',
        ctx,
        resource: clientCreated.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(201).json({ message: 'Cliente creado!', client: clientCreated })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo crear el cliente!' })
    }
  }

  public getAllClients = async ({ response }: HttpContext) => {
    console.log('aqui')

    try {
      const clients = await this.clientUseCases.getAllClients()
      console.log('clients', clients)

      if (clients.length === 0)
        return response.status(404).json({ error: 'No existen clientes registrados' })

      return response.status(200).json({ message: 'Clientes listados!', clients })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudieron obtener los clientes!' })
    }
  }

  public getClientByUuid = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const client = await this.clientUseCases.getClientByUuid(uuid)
      if (!client) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      return response.status(200).json({ message: 'Cliente listado!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public updateClient = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()
    const { name, endpointAuth, endpointRollback, endpointBet, endpointWin } = request.body()

    if (!name && !endpointAuth && !endpointRollback && !endpointBet && !endpointWin)
      return response.status(401).json({ error: 'Debe enviar los datos de actualización!' })

    const dataToUpdate: UpdateClientEntity = {
      name,
      endpointAuth,
      endpointRollback,
      endpointBet,
      endpointWin,
    }

    try {
      const client = await this.clientUseCases.updateClient(uuid, dataToUpdate)
      if (!client) return response.status(404).json({ error: 'No se encuentra el client!' })

      response.status(200).json({ message: 'Cliente actualizado!', client })
    } catch (error) {
      console.log('ERROR UPDATING CLIENT', error)
      response.status(400).json({ msg: 'No se pudo actualizar el cliente!' })
    }
  }

  public deleteClient = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const client = await this.clientUseCases.deleteClient(uuid)
      if (!client) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      return response.status(200).json({ message: 'Cliente eliminado!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public disableClient = async ({ request, response }: HttpContext) => {
    const { uuid } = request.body()

    if (!uuid) return response.status(401).json({ error: 'Debe enviar el uuid del cliente!' })

    try {
      const client = await this.clientUseCases.disableClient(uuid)
      if (!client) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      return response.status(200).json({ message: 'Cliente deshabilitado!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public enableClient = async ({ request, response }: HttpContext) => {
    const { uuid } = request.body()

    if (!uuid) return response.status(401).json({ error: 'Debe enviar el uuid del cliente!' })

    try {
      const client = await this.clientUseCases.enableClient(uuid)
      if (!client) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      return response.status(200).json({ message: 'Cliente habilitado!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public addGameToClient = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { gameUuid } = request.body()
    if (!gameUuid) return response.status(401).json({ error: 'Debe enviar el uuid del game!' })

    try {
      const game = await gameUseCases.getGameByUuid(gameUuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      const clientExist = await this.clientUseCases.getClientByUuid(uuid)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      if (clientExist.games?.includes(gameUuid))
        return response.status(400).json({ error: 'El juego ya fue agregado el cliente!' })

      const client = await this.clientUseCases.addGameToClient(uuid, gameUuid)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Agregar juego al cliente!',
        ctx,
        resource: client?.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Juego agregado al cliente!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo agregar el juego al cliente!' })
    }
  }

  public getAllGamesInClient = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const client = await this.clientUseCases.getClientByUuid(uuid)
      if (!client) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const { games } = client
      if (!games || games.length === 0)
        return response.status(404).json({ error: 'El cliente no tiene juegos agregados!' })

      const allGames = await gameUseCases.gamesInTheClient(games)
      if (!allGames.length)
        return response
          .status(404)
          .json({ error: 'No se encontraron los juegos asociados al cliente!' })

      return response.status(200).json({ message: 'Juegos listados!', games: allGames })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public getAvailableGamesInClient = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const client = await this.clientUseCases.getAvailableGamesInClient(uuid)
      if (!client) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const { games } = client
      if (!games || games.length === 0)
        return response.status(404).json({ error: 'El cliente no tiene juegos agregados!' })

      const allGames = await gameUseCases.gamesAvailableOnTheClient(games)
      if (!allGames)
        return response
          .status(404)
          .json({ error: 'No se encontraron juegos disponibles en el cliente!' })

      return response.status(200).json({ message: 'Juegos listados!', games: allGames })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public addCurrencyToClient = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const { uuid } = request.params()
    const { currency } = request.body()
    if (!currency) return response.status(401).json({ error: 'Debe enviar la moneda!' })

    try {
      const clientExist = await this.clientUseCases.getClientByUuid(uuid)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      if (clientExist.currencies?.includes(currency))
        return response.status(400).json({ error: 'La moneda ya fue agregado el cliente!' })

      const client = await this.clientUseCases.addCurrencyToClient(uuid, currency)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Agregar moneda al cliente!',
        ctx,
        resource: client?.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Nueva moneda agregada al cliente!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo agregar la moneda al cliente!' })
    }
  }

  public removeCurrencyToClient = async ({ request, response }: HttpContext) => {
    const { uuid, currency } = request.params()

    if (!currency) return response.status(401).json({ error: 'Debe enviar la moneda!' })

    try {
      const clientExist = await this.clientUseCases.getClientByUuid(uuid)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      if (!clientExist.currencies?.includes(currency))
        return response.status(400).json({ error: 'El cliente no posee esta moneda!' })

      const client = await this.clientUseCases.removeCurrencyToClient(uuid, currency)

      return response.status(200).json({ message: 'Moneda eliminada del cliente!', client })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo agregar la moneda al cliente!' })
    }
  }

  public deleteGame = async ({ request, response }: HttpContext) => {
    try {
      const { uuid, gameUuid } = request.params()
      if (!uuid) return response.status(401).json({ error: 'Uuid del cliente necesario!' })
      if (!gameUuid) return response.status(401).json({ error: 'Uuid del juego necesario!' })

      const clientExist = await this.clientUseCases.getClientByUuid(uuid)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const game = await gameUseCases.getGameByUuid(gameUuid)
      if (!game) return response.status(404).json({ error: 'No se encuentra el juego!' })

      if (!clientExist.games?.includes(gameUuid))
        return response
          .status(400)
          .json({ error: 'la ficha existe, pero no se encuentra asignada a este operador!' })

      const client = await this.clientUseCases.deleteGameInClient(uuid, gameUuid)

      response.status(200).json({ message: 'Juego eliminado', client })
    } catch (error) {
      console.log('ERROR DELETE GAME --> CLIENT CONTROLLER', error)
      response.status(400).json({ error: 'Error eliminando juego del cliente' })
    }
  }
}
