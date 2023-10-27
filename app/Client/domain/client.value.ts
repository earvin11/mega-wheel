import { ClientEntity } from './client.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Client implements ClientEntity {
  public available: boolean
  public endpointAuth: string
  public endpointBet: string
  public endpointRollback: string
  public endpointWin: string
  public name: string
  public status: boolean
  public useLogo: boolean
  public uuid: string

  constructor(client: ClientEntity) {
    const { uuid } = new GenerateId()
    this.uuid = uuid
    this.status = true
    this.available = true
    this.useLogo = false
    this.endpointAuth = client.endpointAuth
    this.endpointBet = client.endpointBet
    this.endpointRollback = client.endpointRollback
    this.endpointWin = client.endpointWin
    this.name = client.name
  }
}
