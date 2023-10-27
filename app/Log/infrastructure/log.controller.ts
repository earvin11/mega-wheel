import { HttpContext } from '@adonisjs/core/build/standalone'
import { LogUseCase } from '../application/LogUseCase'
import { LogEntity } from '../domain/log.entity'

export class LogController {
  constructor(private logUseCase: LogUseCase) {}

  public createLog = async (log: LogEntity) => {
    try {
      const logCreated = await this.logUseCase.createLog(log)
      return logCreated
    } catch (error) {
      throw new Error(error.message)
    }
  }

  public getAllLogs = async ({ request, response }: HttpContext) => {
    const { page, limit } = request.qs();

    if (page === undefined || limit === undefined)
      return response.status(400).json({ error: 'Page y Limit son requeridos!' })

    if (typeof page !== 'number' || typeof limit !== 'number')
      return response.status(400).json({ error: 'Page y Limit deben ser datos numéricos!' })

    try {
      const logs = await this.logUseCase.getAllLogs(page, limit)

      if (logs.length === 0)
        return response
          .status(404)
          .json({ error: 'No se encontraron logs con los parámetros especificados!' })

      return response.status(200).json({ message: 'Logs listados!', logs })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo realizar la consulta!', error })
    }
  }
}
