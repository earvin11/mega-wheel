import { ExchangeEntity } from '../domain/exchange.entity'
import { ExchangeRepository } from '../domain/exchange.repository'
import { Exchange } from '../domain/exchange.value'
import { UpdateExchangeEntity } from '../domain/update.entity'

export class ExchangeUseCases {
  constructor(private readonly exchangeRepository: ExchangeRepository) {}

  public createExchange = async (exchange: ExchangeEntity) => {
    const newExchange = new Exchange(exchange)
    const exchangeCreated = await this.exchangeRepository.createExchange(newExchange)
    return exchangeCreated
  }

  public getExchangeByUuid = async (uuid: string) => {
    const exchange = await this.exchangeRepository.getExchangeByUuid(uuid)
    return exchange
  }

  public disableExchange = async (uuid: string) => {
    const exchange = await this.exchangeRepository.disableExchange(uuid)
    return exchange
  }

  public enableExchange = async (uuid: string) => {
    const exchange = await this.exchangeRepository.enableExchange(uuid)
    return exchange
  }

  public updateExchange = async (uuid: string, dataToUpdate: UpdateExchangeEntity) => {
    const exchange = await this.exchangeRepository.updateExchange(uuid, dataToUpdate)
    return exchange
  }

  public getAllExchanges = async () => {
    const exchanges = await this.exchangeRepository.getAllExchanges()
    return exchanges
  }
}
