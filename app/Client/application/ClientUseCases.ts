import { ClientRepository } from '../domain/client.repository'
import { ClientEntity, UpdateClientEntity } from '../domain/client.entity'
import { Client } from '../domain/client.value'

export class ClientUseCases {
  constructor(private readonly clientRepository: ClientRepository) {}

  public createClient = async (client: ClientEntity) => {
    const newClient = new Client(client)
    const clientCreated = await this.clientRepository.createClient(newClient)
    return clientCreated
  }

  public getAllClients = async () => {
    const operators = await this.clientRepository.getAllClients()
    return operators
  }

  public getClientByUuid = async (uuid: string) => {
    const client = await this.clientRepository.getClientByUuid(uuid)
    return client
  }

  public updateClient = async (uuid: string, dataToUpdate: UpdateClientEntity) => {
    const client = await this.clientRepository.updateClient(uuid, dataToUpdate)
    return client
  }

  public deleteClient = async (uuid: string) => {
    const client = await this.clientRepository.deleteClient(uuid)
    return client
  }

  public disableClient = async (uuid: string) => {
    const client = await this.clientRepository.disableClient(uuid)
    return client
  }

  public enableClient = async (uuid: string) => {
    const client = await this.clientRepository.enableClient(uuid)
    return client
  }

  public addGameToClient = async (uuid: string, gameUuid: string) => {
    const client = await this.clientRepository.addGameToClient(uuid, gameUuid)
    return client
  }

  public getAllGamesInClient = async (uuid: string) => {
    const client = await this.clientRepository.getAllGamesInClient(uuid)
    return client
  }

  public getAvailableGamesInClient = async (uuid: string) => {
    const client = await this.clientRepository.getAvailableGamesInClient(uuid)
    return client
  }

  // public getClientsByGame = async (gameUuid: string) => {
  //   const clients = await this.clientRepository.getClientsByGame(gameUuid)
  //   return clients
  // }

  public addCurrencyToClient = async (uuid: string, currency: string) => {
    const client = await this.clientRepository.addCurrencyToClient(uuid, currency)
    return client
  }

  public removeCurrencyToClient = async (uuid: string, currency: string) => {
    const client = await this.clientRepository.removeCurrencyToClient(uuid, currency)
    return client
  }

  public deleteGameInClient = async (uuid: string, gameUuid: string) => {
    const client = await this.clientRepository.deleteGameInClient(uuid, gameUuid)
    return client
  }
}
