import { LogEntity } from './log.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Log implements LogEntity {
  public request: string
  public response: string
  public error: string
  public success: string
  public ip: string
  public player: string
  public uuid: string

  constructor(log: LogEntity) {
    const { uuid } = new GenerateId()
    this.uuid = uuid
    this.request = log.request
    this.response = log.response
    this.ip = log.ip
    this.player = log.player
    this.error = log.error
  }
}
