import { FilterReportInterface } from '../domain/reports.entity'
import { ReportsRepository } from '../domain/reports.repository'

export class ReportsUseCases {
  constructor(private readonly reportRepository: ReportsRepository) { }

  public getRounds = async (filter: FilterReportInterface) => {
    const rounds = await this.reportRepository.getRounds(filter)
    return rounds
  }

  // public getTransactions = async (filter: FilterReportInterface) => {
  //   const transactions = await this.reportRepository.getTransactions(filter)
  //   return transactions
  // }

  // public getBetInTransaction = async (uuid: string, type: string) => {
  //   const bet = await this.reportRepository.getBetInTransaction(uuid, type)
  //   return bet
  // }

  // public getCurrencyFluctuation = async (filter: FilterReportInterface) => {
  //   const currency = await this.reportRepository.getCurrencyFluctuation(filter)
  //   return currency
  // }

  // public getDataEarningsInTransaction = async (uuid: string, type: string) => {
  //   const details = await this.reportRepository.getDataEarningsInTransaction(uuid, type)
  //   return details
  // }

  // public getGgrByCasino = async (filter: FilterReportInterface) => {
  //   const ggr = await this.reportRepository.getGgrByCasino(filter)
  //   return ggr
  // }
}
