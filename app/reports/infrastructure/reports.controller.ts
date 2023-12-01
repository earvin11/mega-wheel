import { HttpContext } from '@adonisjs/core/build/standalone'
import { ReportsUseCases } from '../application/ReportsUseCases'
import { FilterReportInterface } from '../domain/reports.entity'
// import { TypesTransaction } from 'App/Transactions/domain/transaction.entity'
// import { VisitsUseCases } from 'App/Visits/application/visitsUseCases'
// import { TransactionUseCases } from 'App/Transactions/application/TransactionUseCases'

export class ReportsController {
  constructor(private reportsUseCases: ReportsUseCases) { }

  public getRounds = async (ctx: HttpContext) => {
    const { response, request } = ctx
    const filter = request.qs()

    try {
      const rounds = await this.reportsUseCases.getRounds(filter as FilterReportInterface)

      response.json({
        message: 'Rounds obtained!',
        rounds,
      })
    } catch (error) {
      console.log('ERROR ROUNDS -> REPORTS CONTROLLER', error)
      response.status(400).json({ error, message: 'Error getting rounds in reports' })
    }
  }

  public getTransactions = async (ctx: HttpContext) => {
    const { response, request } = ctx
    const filter = request.qs()

    try {
      const transactions = await this.reportsUseCases.getTransactions(
        filter as FilterReportInterface,
      )

      response.json({
        message: 'Transactions obtained!',
        transactions,
      })
    } catch (error) {
      console.log('ERROR TRANSACTIONS -> REPORTS CONTROLLER', error)
      response.status(400).json({ error, message: 'Error getting transactions in reports' })
    }
  }
}
