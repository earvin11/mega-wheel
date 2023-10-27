import LogModel from './log.model'
import { LogRepository } from '../domain/log.repository'
import { LogEntity } from '../domain/log.entity'

export class MongoLogRepository implements LogRepository {
  public createLog = async (log: LogEntity): Promise<LogEntity> => {
    const logCreated = await LogModel.create(log)
    return logCreated
  }

  public getAllLogs = async (page: number, limit: number): Promise<LogEntity[] | []> => {
    const logs = await LogModel.find().skip(page).limit(limit)
    return logs
  }
}
