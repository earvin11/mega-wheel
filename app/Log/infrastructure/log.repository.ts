import LogModel from './log.model'
import { LogRepository } from '../domain/log.repository'
import { FilterLog, LogEntity, TypesLogsErrors } from '../domain/log.entity'

export class MongoLogRepository implements LogRepository {
  public createLog = async (log: LogEntity): Promise<LogEntity> => {
    const logCreated = await LogModel.create(log)
    return logCreated
  }

  public getAllLogs = async (page: number, limit: number, typeError?: TypesLogsErrors): Promise<LogEntity[] | []> => {

    let filter : FilterLog = {};

    if (typeError) {
      filter.typeError = typeError;
    }

    const logs = await LogModel.find(filter).skip(Number(page)).limit(Number(limit))
    return logs
  }
}
