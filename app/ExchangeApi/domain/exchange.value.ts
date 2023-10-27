import { GenerateId } from 'App/Shared/Helpers/generate-id.helpers'
import { ExchangeEntity } from './exchange.entity'

export class Exchange implements ExchangeEntity {
  public name: string
  public status: boolean
  public url: string
  public uuid: string

  constructor(exchange: ExchangeEntity) {
    const { uuid } = new GenerateId()
    this.name = exchange.name
    this.status = true
    this.url = exchange.url
    this.uuid = uuid
  }
}
