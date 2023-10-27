import { AnswerTicket } from '../domain/answer.entity'
import { SearchTickets } from '../domain/search.entity'
import { SupportEntity } from '../domain/support.entity'
import { SupportRepository } from '../domain/support.repository'
import { TicketUpdate } from '../domain/ticketUpdate.entity'
import SupportModel from './support.model'

export class SupportMongoRepository implements SupportRepository {
  public createSupportTicket = async (ticket: SupportEntity): Promise<SupportEntity> => {
    const ticketCreated = await SupportModel.create(ticket)
    return ticketCreated
  }

  public getSupportTicketByUuid = async (ticketUuid: string): Promise<SupportEntity | null> => {
    const ticket = await SupportModel.findOne({ uuid: ticketUuid }).exec()
    if (!ticket) return null

    return ticket
  }

  public deleteSupportTicket = async (ticketUuid: string): Promise<SupportEntity | null> => {
    const ticket = await SupportModel.findOneAndDelete({ uuid: ticketUuid }).exec()
    if (!ticket) return null

    return ticket
  }

  public updateSupportTicket = async (
    ticketUuid: string,
    dataToUpdate: TicketUpdate
  ): Promise<SupportEntity | null> => {
    const ticket = await SupportModel.findOneAndUpdate({ uuid: ticketUuid }, dataToUpdate, {
      new: true,
    }).exec()
    if (!ticket) return null

    return ticket
  }

  public searchSupportTickets = async (filters: SearchTickets): Promise<SupportEntity[] | []> => {
    const findTickets = {}

    if (filters.playerEmail) findTickets['playerEmail'] = filters.playerEmail
    if (filters.operator) findTickets['operator'] = filters.operator

    if (filters.fromDate && filters.toDate) {
      if (filters.toDate === filters.fromDate) {
        const [year, month, day] = filters.fromDate.split('-')

        findTickets['createdAt'] = {
          $lte: new Date(`${month}-${day}-${year} 23:59:59`),
          $gte: new Date(`${month}-${day}-${year} 00:00:00`),
        }
      } else {
        findTickets['createdAt'] = {
          $lte: new Date(filters.toDate),
          $gte: new Date(filters.fromDate),
        }
      }
    }

    const tickets = await SupportModel.find(findTickets)
      .skip(filters.page)
      .limit(filters.limit)
      .exec()

    return tickets
  }

  public answerTicket = async (
    ticketUuid: string,
    dataToAnswer: AnswerTicket
  ): Promise<SupportEntity | null> => {
    const ticket = await SupportModel.findOneAndUpdate({ uuid: ticketUuid }, dataToAnswer, {
      new: true,
    }).exec()
    if (!ticket) return null

    return ticket
  }
}
