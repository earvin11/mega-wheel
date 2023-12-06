// INTERFACES
import {
  FilterReportInterface,
  RoundReportEnitity,
  TransactionReportInterface,
} from '../domain/reports.entity'
import { ReportsRepository } from '../domain/reports.repository'
// import { CurrencyEntity } from '../../Currencies/domain/currency.entity'
//USE CASES
import { OperatorUseCases } from '../../Operator/application/OperatorUseCases'
import { clientUseCases } from 'App/Operator/infrastructure/dependencies'
import RoundModel from 'App/Round/infraestructure/round.model'
// import OperatorModel from 'App/Operator/infrastructure/operator.model'
//FUNCTIONS
import { FormatDate } from 'App/Shared/Helpers/formate-date'
import TransactionModel from 'App/Transaction/infrastructure/transactions.model'

export class ReportsMongoRepository implements ReportsRepository {
  constructor(private operatorUseCases: OperatorUseCases) { }

  public getRounds = async (
    filterData: FilterReportInterface,
  ): Promise<RoundReportEnitity[] | []> => {
    const {
      page = 1,
      limit = 10,
      game,
      client,
      operator,
      identifierNumber,
      startDate,
      endDate,
    } = filterData

    let filter: {
      games?: string[]
    } = {}

    let games: string[] = []

    if (startDate && endDate) {
      filter['createdAt'] = {
        $lte: FormatDate(startDate, endDate).end_date,
        $gte: FormatDate(startDate, endDate).start_date,
      }
    }

    if (client) {
      const clientExist = await clientUseCases.getClientByUuid(client)

      if (clientExist) {
        const clientGames = clientExist?.games as string[]
        games.push(...clientGames)
      }
    }

    if (operator) {
      const operatorExist = await this.operatorUseCases.getOperatorByUuid(operator)
      if (operatorExist) {
        const operatorGames: string[] = operatorExist?.operatorGamesLimits
          ?.filter(({ game }) => game.type === 'WHEEL')
          .map(({ game }) => game.uuid) as string[]

        games.push(...operatorGames)
      }
      games.push('X')
    }

    if (games.length) filter['game.uuid'] = { $in: games }

    if (game) {
      filter['game.uuid'] = game
    }

    if (identifierNumber) {
      filter['identifierNumber'] = identifierNumber
    }

    const aggregate = [
      {
        $lookup: {
          from: 'games',
          localField: 'gameUuid',
          foreignField: 'uuid',
          as: 'game',
        },
      },
      {
        $unwind: '$game',
      },
      {
        $project: {
          'gameUuid': 1,
          'start_date': 1,
          'end_date': 1,
          'identifierNumber': 1,
          'uuid': 1,
          'result': 1,
          'open': 1,
          'jackpot': 1,
          'game.uuid': 1,
          'game.name': 1,
          'createdAt': 1,
        },
      },
      {
        $match: {
          ...filter,
        },
      },
    ]

    const rounds = await RoundModel.aggregate([
      { $sort: { createdAt: -1 } },
      ...aggregate,
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
    ])

    return rounds
  }

  public getTransactions = async (
    filterData: FilterReportInterface,
  ): Promise<TransactionReportInterface[] | []> => {
    const {
      page = 1,
      limit = 10,
      game,
      client,
      operator,
      identifierNumber,
      startDate,
      endDate,
      currency,
      player,
      transactionId,
      wl,
    } = filterData

    let filter: {
      games?: string[]
    } = {}

    if (startDate && endDate) {
      filter['createdAt'] = {
        $lte: FormatDate(startDate, endDate).end_date,
        $gte: FormatDate(startDate, endDate).start_date,
      }
    }

    if (game) filter['game.uuid'] = game

    if (identifierNumber) filter['round.identifierNumber'] = identifierNumber

    if (client) filter['player.operator.client'] = client

    if (operator) filter['player.operator.uuid'] = operator

    if (currency) filter['currency.uuid'] = currency

    if (player) filter['player.uuid'] = player

    if (wl) filter['player.WL'] = wl

    if (transactionId) filter['uuid'] = transactionId

    const aggregate = [
      {
        $lookup: {
          from: 'clients',
          localField: 'player.operator.client',
          foreignField: 'uuid',
          as: 'clientPlayer',
        },
      },
      {
        $unwind: '$clientPlayer',
      },
      {
        $project: {
          'amount': 1,
          'amountExchangeDollar': 1,
          'currencyExchangeDollar': 1,
          'createdAt': 1,
          'platform': 1,
          'playerIp': 1,
          'playerCountry': 1,
          'typeTransaction': 1,
          'userAgent': 1,
          'userBalance': 1,
          'uuid': 1,
          'bet.uuid': 1,
          'currency.uuid': 1,
          'currency.isoCode': 1,
          'player.userId': 1,
          'player.username': 1,
          'player.WL': 1,
          'player.currencyUuid': 1,
          'player.operator.name': 1,
          'player.operator.client': 1,
          'player.operator.uuid': 1,
          'round.identifierNumber': 1,
          'round.result': 1,
          'game.uuid': 1,
          'game.name': 1,
          'clientPlayer.name': 1,
        },
      },
      {
        $match: {
          ...filter,
        },
      },
    ]

    const transactions = await TransactionModel.aggregate([
      { $sort: { createdAt: -1 } },
      ...aggregate,
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
    ])

    return transactions
  }
}
