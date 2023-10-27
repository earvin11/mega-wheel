import { CurrencyEntity } from './currency.entity'

export interface UpdateCurrencyEntity extends Pick<CurrencyEntity, 'isoCode' | 'name' | 'status' > {}
