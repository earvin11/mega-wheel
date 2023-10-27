import { AuditoryUseCase } from '../application/AuditoryUseCase'
import { AuditoryEntity } from '../domain/auditory.entity'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { SearchAuditoriesParams } from '../domain/search.entity'
export class AuditoryController {
  constructor(private auditoryUseCase: AuditoryUseCase) {}

  public createAuditory = async (auditory: AuditoryEntity) => {
    try {
      await this.auditoryUseCase.createAuditory(auditory)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  public searchAuditories = async ({ request, response }: HttpContext) => {
    const { page, limit, action, toDate, fromDate } = request.body()

    if (!page || !limit)
      return response.status(400).json({ error: 'Proporcione la información necesaria!' })

    const searchParams: SearchAuditoriesParams = {
      limit,
      page,
      action,
      fromDate,
      toDate,
    }

    try {
      const auditories = await this.auditoryUseCase.searchAuditories(searchParams)
      if (auditories['auditories'].length === 0)
        return response.status(404).json({ error: 'No se encontraron coincidencias!' })

      return response.status(200).json({ message: 'Auditorias encontradas!', auditories })
    } catch (error) {
      return response.status(500).json(error)
    }
  }
}
