import { LogEntity, TypesLogsErrors } from './log.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Log implements LogEntity {
  public typeError: TypesLogsErrors
  public request?: any
  public response?: any
  public error?: string
  public ip?: string
  public player?: string
  public uuid: string

  constructor(log: LogEntity) {
    const { uuid } = new GenerateId()
    this.uuid = uuid
    this.typeError = log.typeError
    this.request = log.request
    this.response = log.response
    this.ip = log.ip
    this.player = log.player
    this.error = log.error
  }
}
