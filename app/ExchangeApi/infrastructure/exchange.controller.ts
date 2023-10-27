import { HttpContext } from '@adonisjs/core/build/standalone'
import { ExchangeUseCases } from '../application/exchangeUseCases'
import { ExchangeEntity } from '../domain/exchange.entity'
import { UpdateExchangeEntity } from '../domain/update.entity'

export class ExchangeController {
  constructor(private exchangeUseCases: ExchangeUseCases) {}

  public createExchange = async ({ request, response }: HttpContext) => {
    const { name, url } = request.body()

    if (!name || !url)
      return response.status(400).json({ error: 'Debe enviar el nombre y la url del exchange!' })

    const exchange: ExchangeEntity = {
      name,
      url,
    }

    try {
      const exchangeCreated = await this.exchangeUseCases.createExchange(exchange)
      return response.status(201).json({ message: 'Exchange creado!', exchange: exchangeCreated })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo crear el nuevo exchange!', error })
    }
  }

  public getExchangeByUuid = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const exchange = await this.exchangeUseCases.getExchangeByUuid(uuid)
      if (!exchange) return response.status(404).json({ error: 'No se encuentra el exchange!' })

      return response.status(200).json({ message: 'Exchange listado!', exchange })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo obtener el exchange!', error })
    }
  }

  public disableExchange = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const exchange = await this.exchangeUseCases.disableExchange(uuid)
      if (!exchange) return response.status(404).json({ error: 'No se encuentra el exchange!' })

      return response.status(200).json({ message: 'Exchange deshabilitado!', exchange })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo deshabilitar el exchange!', error })
    }
  }

  public enableExchange = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const exchange = await this.exchangeUseCases.enableExchange(uuid)
      if (!exchange) return response.status(404).json({ error: 'No se encuentra el exchange!' })

      return response.status(200).json({ message: 'Exchange habilitado!', exchange })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo habilitar el exchange!', error })
    }
  }

  public updateExchange = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()
    const { name, url } = request.body()

    if (!name && !url)
      return response
        .status(400)
        .json({ error: 'Debe enviar el nombre o la url que sesea actualizar!' })

    const dataToUpdate: UpdateExchangeEntity = {
      name,
      url,
    }

    try {
      const exchange = await this.exchangeUseCases.updateExchange(uuid, dataToUpdate)
      if (!exchange) return response.status(404).json({ error: 'No se encuentra el exchange!' })

      return response.status(200).json({ message: 'Exchange actualizado!', exchange })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo actualizar el exchange!', error })
    }
  }

  public getAllExchanges = async ({ response }: HttpContext) => {
    try {
      const exchanges = await this.exchangeUseCases.getAllExchanges()
      if (exchanges.length === 0)
        return response.status(404).json({ error: 'No existen exchanges habilitados!' })

      return response.status(200).json({ message: 'Exchanges listados!', exchanges })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudieron obtener los exchanges!', error })
    }
  }
}
