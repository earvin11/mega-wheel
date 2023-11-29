// import { BetFields } from 'App/Bet/domain/bet.entity'
import {
  // FilterEarnings,
  FilterReportInterface,
  RoundReportEnitity,
  // TransactionReportInterface,
} from './reports.entity'
// import { CurrencyEntity } from 'App/Currencies/domain/currency.entity'

export interface ReportsRepository {
  getRounds(filter: FilterReportInterface): Promise<RoundReportEnitity[] | []>
  // getTransactions(filter: FilterReportInterface): Promise<TransactionReportInterface[] | []>
  // getBetInTransaction(uuid: string, type: string): Promise<BetFields | null>
  // getCurrencyFluctuation(filter: FilterReportInterface): Promise<CurrencyEntity[] | []>
  // getDataEarningsInTransaction(uuid: string, type: string): Promise<FilterEarnings | null>
  // getGgrByCasino(filter: FilterReportInterface): Promise<null | any>
}
