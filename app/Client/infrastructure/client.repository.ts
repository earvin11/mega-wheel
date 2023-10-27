import ClientModel from './client.model'
import { ClientEntity, UpdateClientEntity } from '../domain/client.entity'
import { ClientRepository } from '../domain/client.repository'


export class ClientMongoRepository implements ClientRepository {
  public createClient = async (client: ClientEntity): Promise<ClientEntity> => {
    const clientCreated = await ClientModel.create(client)
    return clientCreated
  }

  public getAllClients = async (): Promise<ClientEntity[] | []> => {
    const clients = await ClientModel.find().exec()
    return clients
  }

  public getClientByUuid = async (uuid: string): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOne({ uuid }).exec()
    if (!client) return null

    return client
  }

  public updateClient = async (uuid: string,dataToUpdate:UpdateClientEntity): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate({ uuid }, dataToUpdate, {
      new: true,
    }).exec()
    if (!client) return null

    return client
  }

  public deleteClient = async (uuid: string): Promise<ClientEntity | null> => {
    
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { status: false },
      { new: true },
    ).exec()
    if (!client) return null

    return client
  
  }

  public disableClient = async (uuid: string): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { available: false },
      { new: true },
    ).exec()
    if (!client) return null

    return client
  }

  public enableClient = async (uuid: string): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { available: true },
      { new: true },
    ).exec()
    if (!client) return null

    return client
  }

  public addGameToClient = async (uuid: string, gameUuid: string): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { $push: { games: gameUuid } },
      { new: true },
    ).exec()
    if (!client) return null

    return client
  }

  // public getAllGamesInClient = this.getClientByUuid
  public getAllGamesInClient = async( uuid: string ): Promise<string[] | []> => {
    const client = await this.getClientByUuid(uuid);
    if(!client) return [];

    const games = client.games;
    if(!games) return [];
    
    return games;
  }
  
  public getAvailableGamesInClient = this.getClientByUuid

  // public getClientsByGame = async (gameUuid: string): Promise<ClientEntity[] | []> => {
  //   const clients = await ClientModel.find({ games: gameUuid }).exec()
  //   return clients
  // }

  public addCurrencyToClient = async (
    uuid: string,
    currency: string,
  ): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { $push: { currencies: currency } },
      { new: true },
    ).exec()
    if (!client) return null

    return client
  }

  public removeCurrencyToClient = async (
    uuid: string,
    currency: string
  ): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { $pull: { currencies: currency } },
      { new: true },
    ).exec()

    if (!client) return null

    return client
  }

  public deleteGameInClient = async (
    uuid: string,
    gameUuid: string,
  ): Promise<ClientEntity | null> => {
    const client = await ClientModel.findOneAndUpdate(
      { uuid },
      { $pull: { games: gameUuid } },
      { new: true },
    ).exec()

    if (!client) return null

    return client
  }
}
