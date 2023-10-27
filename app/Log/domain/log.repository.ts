import { LogEntity } from './log.entity'

export interface LogRepository {
  createLog(log: LogEntity): Promise<LogEntity>
  getAllLogs(page: number, limit: number): Promise<LogEntity[] | []>
}
