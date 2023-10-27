import { SupportEntity } from './support.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Support implements SupportEntity {
  public description: string
  public playerEmail: string
  public title: string
  public uuid: string
  public operator: string
  public answer: string

  constructor(ticket: SupportEntity) {
    const { uuid } = new GenerateId()
    this.description = ticket.description
    this.playerEmail = ticket.playerEmail
    this.title = ticket.title
    this.uuid = uuid
    this.operator = ''
    this.answer = ''
  }
}
