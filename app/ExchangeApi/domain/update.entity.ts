import { ExchangeEntity } from './exchange.entity'

export interface UpdateExchangeEntity extends Pick<ExchangeEntity, 'name' | 'url'> {}
