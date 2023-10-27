import { AuditoryEntity } from '../domain/auditory.entity'
import { AuditoryRepository } from '../domain/auditory.repository'
import { SearchAuditoriesParams } from '../domain/search.entity'
import AuditoryModel from './auditory.model'

export class AuditoryMongoRepository implements AuditoryRepository {
  public createAuditory = async (auditory: AuditoryEntity): Promise<void> => {
    await AuditoryModel.create(auditory)
  }

  public searchAuditories = async ({
    limit,
    page,
    action,
    fromDate,
    toDate,
  }: SearchAuditoriesParams): Promise<{ total: number; auditories: AuditoryEntity[] } | {}> => {
    const searchParams = {}

    if (toDate && fromDate) {
      if (toDate === fromDate) {
        const [year, month, day] = fromDate.split('-')

        searchParams['createdAt'] = {
          $lte: new Date(`${month}-${day}-${year} 23:59:59`),
          $gte: new Date(`${month}-${day}-${year} 00:00:00`),
        }
      } else {
        searchParams['createdAt'] = {
          $lte: new Date(toDate),
          $gte: new Date(fromDate),
        }
      }
      console.log(searchParams['createdAt'])
    }

    if (action) {
      searchParams['typeAction'] = action
    }

    const aggregateParams = [
      {
        $lookup: {
          from: 'users',
          localField: 'user_uuid',
          foreignField: 'uuid',
          as: 'user',
        },
      },
      {
        $match: {
          ...searchParams,
        },
      },
    ]

    const [total, auditories] = await Promise.all([
      AuditoryModel.countDocuments(),
      AuditoryModel.aggregate([
        { $sort: { createdAt: -1 } },
        {
          $skip: (page - 1) * limit,
        },
        ...aggregateParams,
        {
          $limit: limit,
        },
      ]),
    ])

    if (total === 0 || !auditories) return {}

    const response = { total, auditories }
    return response
  }
}
