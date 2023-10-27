import { ExchangeEntity } from '../domain/exchange.entity'
import { ExchangeRepository } from '../domain/exchange.repository'
import { UpdateExchangeEntity } from '../domain/update.entity'
import ExchangeModel from './exchange.model'

export class ExchangeMongoRepository implements ExchangeRepository {
  public createExchange = async (exchange: ExchangeEntity): Promise<ExchangeEntity> => {
    const exchangeCreated = await ExchangeModel.create(exchange)
    return exchangeCreated
  }

  public getExchangeByUuid = async (uuid: string): Promise<ExchangeEntity | null> => {
    const exchange = await ExchangeModel.findOne({ uuid }).exec()
    if (!exchange) return null

    return exchange
  }

  public disableExchange = async (uuid: string): Promise<ExchangeEntity | null> => {
    const exchange = await ExchangeModel.findOneAndUpdate(
      { uuid },
      { status: false },
      { new: true }
    ).exec()
    if (!exchange) return null

    return exchange
  }

  public enableExchange = async (uuid: string): Promise<ExchangeEntity | null> => {
    const exchange = await ExchangeModel.findOneAndUpdate(
      { uuid },
      { status: true },
      { new: true }
    ).exec()
    if (!exchange) return null

    return exchange
  }

  public updateExchange = async (
    uuid: string,
    dataToUpdate: UpdateExchangeEntity
  ): Promise<ExchangeEntity | null> => {
    const exchange = await ExchangeModel.findOneAndUpdate({ uuid }, dataToUpdate, {
      new: true,
    }).exec()
    if (!exchange) return null

    return exchange
  }

  public getAllExchanges = async (): Promise<ExchangeEntity[] | []> => {
    const exchanges = await ExchangeModel.find().exec()
    return exchanges
  }
}
