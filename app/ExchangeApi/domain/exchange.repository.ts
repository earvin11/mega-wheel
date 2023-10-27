import { ExchangeEntity } from './exchange.entity'
import { UpdateExchangeEntity } from './update.entity'

export interface ExchangeRepository {
  createExchange(exchange: ExchangeEntity): Promise<ExchangeEntity>
  getExchangeByUuid(uuid: string): Promise<ExchangeEntity | null>
  disableExchange(uuid: string): Promise<ExchangeEntity | null>
  enableExchange(uuid: string): Promise<ExchangeEntity | null>
  updateExchange(uuid: string, dataToUpdate: UpdateExchangeEntity): Promise<ExchangeEntity | null>
  getAllExchanges(): Promise<ExchangeEntity[] | []>
}
