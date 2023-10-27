import { AnswerTicket } from './answer.entity'
import { SearchTickets } from './search.entity'
import { SupportEntity } from './support.entity'
import { TicketUpdate } from './ticketUpdate.entity'

export interface SupportRepository {
  createSupportTicket(ticket: SupportEntity): Promise<SupportEntity>
  getSupportTicketByUuid(ticketUuid: string): Promise<SupportEntity | null>
  deleteSupportTicket(ticketUuid: string): Promise<SupportEntity | null>
  updateSupportTicket(ticketUuid: string, dataToUpdate: TicketUpdate): Promise<SupportEntity | null>
  searchSupportTickets(filters: SearchTickets): Promise<SupportEntity[] | []>
  answerTicket(ticketUuid: string, dataToAnswer: AnswerTicket): Promise<SupportEntity | null>
}
