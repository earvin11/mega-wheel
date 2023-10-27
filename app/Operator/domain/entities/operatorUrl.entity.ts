import { OperatorEntity } from './operator.entity'

export interface OperatorUrlEntity
  extends Pick<
    OperatorEntity,
    'endpointAuth' | 'endpointBet' | 'endpointWin' | 'endpointRollback'
  > {}
