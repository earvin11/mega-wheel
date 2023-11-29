// INTERFACES
import { FilterReportInterface, RoundReportEnitity } from '../domain/reports.entity'
import { ReportsRepository } from '../domain/reports.repository'
// import { CurrencyEntity } from '../../Currencies/domain/currency.entity'
//USE CASES
import { OperatorUseCases } from '../../Operator/application/OperatorUseCases'
import { clientUseCases } from 'App/Operator/infrastructure/dependencies'
import RoundModel from 'App/Round/infraestructure/round.model'
// import OperatorModel from 'App/Operator/infrastructure/operator.model'
//FUNCTIONS
import { FormatDate } from 'App/Shared/Helpers/formate-date'

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
}
