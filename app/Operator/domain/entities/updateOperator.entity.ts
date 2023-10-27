import { OperatorEntity } from './operator.entity'

export interface UpdateOperatorEntity
  extends Pick<OperatorEntity, 'casinoToken' | 'client' | 'name' | 'maxBet' | 'minBet'> {}
