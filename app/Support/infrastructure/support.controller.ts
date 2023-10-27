import { SupportUseCases } from '../application/supportUseCases'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { SupportEntity } from '../domain/support.entity'
import { getPlayerAuth } from '../../Shared/Helpers/getPlayerAuth'
import { TicketUpdate } from '../domain/ticketUpdate.entity'
import { SearchTickets } from '../domain/search.entity'
import { AnswerTicket } from '../domain/answer.entity'
import { operatorUseCases } from 'App/Operator/infrastructure/dependencies'

export class SupportController {
  constructor(private supportUseCases: SupportUseCases) {}

  public createSupportTicket = async ({ request, response }: HttpContext) => {
    const { description, tokenAuth, title } = request.body()
    // ?Test: tokenAuth = 'D3AG408jolF1OA6KDyoGcKr4kwlyAKuxyRMWybzWH7j'

    try {
      const playerAuth = await getPlayerAuth({ token: tokenAuth })
      if (!playerAuth) return response.status(404).json({ error: 'No se encuentra el jugador!' })

      const ticket: SupportEntity = {
        description,
        playerEmail: playerAuth.data.username,
        title,
      }

      const ticketCreated = await this.supportUseCases.createSupportTicket(ticket)

      return response
        .status(201)
        .json({ message: 'Ticket de soporte creado!', ticket: ticketCreated })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo crear el ticket de soporte!' })
    }
  }

  public getSupportTicketByUuid = async ({ request, response }: HttpContext) => {
    const { ticketUuid } = request.params()

    try {
      const ticket = await this.supportUseCases.getSupportTicketByUuid(ticketUuid)
      if (!ticket)
        return response.status(404).json({ error: 'No se encuentra el ticket de soporte!' })

      return response.status(200).json({ message: 'Ticket listado!', ticket })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo obtener el ticket de soporte!' })
    }
  }

  public deleteSupportTicket = async ({ request, response }: HttpContext) => {
    const { ticketUuid } = request.params()

    try {
      const ticket = await this.supportUseCases.deleteSupportTicket(ticketUuid)
      if (!ticket)
        return response.status(404).json({ error: 'No se encuentra el ticket de soporte!' })

      return response.status(200).json({ message: 'Ticket eliminado!', ticket })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo eliminar el ticket de soporte!' })
    }
  }

  public updateSupportTicket = async ({ request, response }: HttpContext) => {
    const { ticketUuid } = request.params()
    const { title, description, tokenAuth } = request.body()

    if (!tokenAuth) return response.status(401).json({ error: 'Debe autenticarse en el sistema!' })
    if (!title && !description)
      return response
        .status(404)
        .json({ error: 'Debe enviar el título o la descripción que desea actualizar!' })

    const dataToUpdate: TicketUpdate = {
      description,
      title,
    }

    try {
      const ticketExist = await this.supportUseCases.getSupportTicketByUuid(ticketUuid)
      if (!ticketExist) return response.status(404).json({ error: 'No se encuentra el ticket!' })

      const playerAuth = await getPlayerAuth({ token: tokenAuth })
      if (!playerAuth) return response.status(404).json({ error: 'No se encuentra el jugador!' })

      if (ticketExist.playerEmail !== playerAuth.data.username)
        return response
          .status(401)
          .json({ error: 'No tiene permisos para editar los tickets de otros jugadores!' })

      const ticket = await this.supportUseCases.updateSupportTicket(ticketUuid, dataToUpdate)
      return response.status(200).json({ message: 'Ticket actualizado!', ticket })
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'No se pudo actualizar el ticket de soporte!', error })
    }
  }

  public searchSupportTickets = async ({ request, response }: HttpContext) => {
    const { limit, page, fromDate, operator, playerEmail, toDate } = request.body()

    if (!limit || !page) return response.status(404).json({ error: 'Debe enviar limit y page!' })

    const filters: SearchTickets = {
      limit,
      page,
      fromDate,
      operator,
      playerEmail,
      toDate,
    }

    try {
      const tickets = await this.supportUseCases.searchSupportTickets(filters)
      if (tickets.length === 0)
        return response
          .status(404)
          .json({ error: 'No se encontraron resultados con los filtros enviados!' })

      return response.status(200).json({ message: 'Tickets listados!', tickets })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudieron obtener los tickets!', error })
    }
  }

  public answerTicket = async ({ request, response }: HttpContext) => {
    const { ticketUuid } = request.params()
    const { answer, operator } = request.body()

    if (!answer || !operator)
      return response.status(404).json({ error: 'Debe enviar la respuesta y el operador!' })

    const dataToAnswer: AnswerTicket = {
      answer,
      operator,
    }

    try {
      const ticketExist = await this.supportUseCases.getSupportTicketByUuid(ticketUuid)
      if (!ticketExist)
        return response.status(404).json({ error: 'No se encuentra el ticket de soporte!' })

      const operatorExist = await operatorUseCases.getOperatorByUuid(operator)
      if (!operatorExist)
        return response.status(404).json({ error: 'No se encuentra el operador!' })

      const ticket = await this.supportUseCases.answerTicket(ticketUuid, dataToAnswer)
      // !Nota: Una vez tenga los email del player, enviar un email con la respuesta.

      return response.status(200).json({ message: 'Respuesta actualizada!', ticket })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo responder al ticket!', error })
    }
  }
}
