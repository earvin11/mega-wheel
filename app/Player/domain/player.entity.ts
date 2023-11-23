import { OperatorEntity } from 'App/Operator/domain/entities'

export interface PlayerEntity {
    userId: string
    username: string
    uuid?: string
    operator: OperatorEntity
    currencyUuid: string
    lastBalance: number
    status?: boolean
    isAdmin?: boolean
    tokenWallet: string
    WL?: string
  }
  
  export interface UpdatePlayerEntity
    extends Pick<PlayerEntity, 'operator' | 'lastBalance' | 'isAdmin' | 'tokenWallet'> {}