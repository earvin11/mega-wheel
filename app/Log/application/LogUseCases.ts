import { LogRepository } from '../domain/log.repository'
import { LogEntity } from '../domain/log.entity'
import { Log } from '../domain/log.value'

export class LogUseCases {
  constructor(private readonly LogRepository: LogRepository) {}

  public createLog = async (log: LogEntity) => {
    const newLog = new Log(log)
    const logCreated = await this.LogRepository.createLog(newLog)
    return logCreated
  }

  public getAllLogs = async (page: number, limit: number, typeError?: string) => {
    const logs = await this.LogRepository.getAllLogs(page, limit, typeError)
    return logs
  }
}
