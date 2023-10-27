import { LogRepository } from '../domain/log.repository'
import { LogEntity } from '../domain/log.entity'
import { Log } from '../domain/log.value'

export class LogUseCase {
  constructor(private readonly LogRepository: LogRepository) {}

  public createLog = async (log: LogEntity) => {
    const newLog = new Log(log)
    const logCreated = await this.LogRepository.createLog(newLog)
    return logCreated
  }

  public getAllLogs = async (page: number, limit: number) => {
    const logs = await this.LogRepository.getAllLogs(page, limit)
    return logs
  }
}
