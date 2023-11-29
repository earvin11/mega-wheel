import { RoundEntity } from 'App/Round/domain/round.entity'

export interface RoundReportEnitity
  extends Pick<
    RoundEntity,
    | 'gameUuid'
    | 'end_date'
    | 'start_date'
    | 'identifierNumber'
    | 'jackpot'
    | 'open'
    | 'providerId'
    | 'result'
  > { }

export interface FilterReportInterface {
  page?: string
  limit?: string
  client?: string
  operator?: string
  currency?: string
  game?: string
  player?: string
  transactionId?: string
  identifierNumber?: string
  startDate?: string
  endDate?: string
  isAdmin?: string
}

// export interface TransactionReportInterface {
//   amount: number
//   amountExchangeDollar: number
//   currencyExchangeDollar: number
//   createdAt: string
//   platform: string
//   playerIp: string
//   playerCountry: string
//   typeTransaction: string
//   userAgent: string
//   userBalance: number
//   uuid: string
//   bet: {
//     uuid: string
//   }
//   currency: {
//     uuid: string
//     isoCode: string
//   }
//   player: {
//     userId: string
//     username: string
//     WL: string
//     currencyUuid: string
//     operator: {
//       uuid: string
//       name: string
//       client: string
//     }
//   }
//   round: {
//     identifierNumber: string
//     result: DragonTigerResultType | null
//   }
//   game: {
//     uuid: string
//     name: string
//   }
// }
export interface FilterEarnings {
  earnings: Earning[]
  totalEarnings: number
  round?: any
}

export interface Earning {
  amountOriginal: number
  bet: string
  earning: number
}
