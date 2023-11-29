import { HttpContext } from '@adonisjs/core/build/standalone'
import { LogUseCases } from '../application/LogUseCases'
import { LogEntity } from '../domain/log.entity'

export class LogController {
  constructor(private logUseCases: LogUseCases) {}

  public createLog = async (log: LogEntity) => {
    try {
      const logCreated = await this.logUseCases.createLog(log)
      return logCreated
    } catch (error) {
      throw new Error(error.message)
    }
  }

  public getAllLogs = async ({ request, response }: HttpContext) => {

    const { page = 1, limit = 10, typeError } = request.qs();

    try {
      const logs = await this.logUseCases.getAllLogs( page, limit, typeError );

      response.ok({ message: 'Logs Listados', logs })
    } catch (error) {
      response.internalServerError({ message: 'Talk to administrator' });
    }
  }
}
