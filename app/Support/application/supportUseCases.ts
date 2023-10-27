import { SupportRepository } from '../domain/support.repository'
import { SupportEntity } from '../domain/support.entity'
import { Support } from '../domain/support.value'
import { TicketUpdate } from '../domain/ticketUpdate.entity'
import { SearchTickets } from '../domain/search.entity'
import { AnswerTicket } from '../domain/answer.entity'

export class SupportUseCases {
  constructor(private readonly supportRepository: SupportRepository) {}

  public createSupportTicket = async (ticket: SupportEntity) => {
    const newTicket = new Support(ticket)
    const ticketCreated = await this.supportRepository.createSupportTicket(newTicket)
    return ticketCreated
  }

  public getSupportTicketByUuid = async (ticketUuid: string) => {
    const ticket = await this.supportRepository.getSupportTicketByUuid(ticketUuid)
    return ticket
  }

  public deleteSupportTicket = async (ticketUuid: string) => {
    const ticket = await this.supportRepository.deleteSupportTicket(ticketUuid)
    return ticket
  }

  public updateSupportTicket = async (ticketUuid: string, dataToUpdate: TicketUpdate) => {
    const ticket = await this.supportRepository.updateSupportTicket(ticketUuid, dataToUpdate)
    return ticket
  }

  public searchSupportTickets = async (filters: SearchTickets) => {
    const tickets = await this.supportRepository.searchSupportTickets(filters)
    return tickets
  }

  public answerTicket = async (ticketUuid: string, dataToAnswer: AnswerTicket) => {
    const ticket = await this.supportRepository.answerTicket(ticketUuid, dataToAnswer)
    return ticket
  }
}
