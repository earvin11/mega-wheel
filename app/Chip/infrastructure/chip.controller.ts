import { ChipUseCases } from '../application/ChipUseCase'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { ChipEntity } from '../domain/chip.entity'
import { CreateAuditoryParams } from '../../Shared/Interfaces/create-auditory.interface'
import CreateAuditory from '../../Shared/Helpers/create-auditory'
import { currencyUseCases } from '../../Currencies/infrastructure/dependencies'
import { operatorUseCases } from '../../Operator/infrastructure/dependencies'

export class ChipController {
  constructor(private chipUseCase: ChipUseCases) {}

  public createChip = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const {
      value,
      primaryColor: primary,
      secondaryColor: secondary,
      currency,
      operator,
    } = request.body()

    try {
      const operatorExist = await operatorUseCases.getOperatorByUuid(operator)
      if (!operatorExist)
        return response.status(404).json({ error: 'No se encuentra el operador!' })

      const currencyExist = await currencyUseCases.getCurrencyByUuid(currency)
      if (!currencyExist) return response.status(404).json({ error: 'No se encuentra la moneda!' })

      const chip: ChipEntity = {
        value,
        color: {
          primary,
          secondary,
        },
        currency: currencyExist.isoCode,
        operator,
      }

      const chipCreated = await this.chipUseCase.createChip(chip)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Crear Ficha!',
        ctx,
        resource: value,
      }
      await CreateAuditory(auditoryParams)

      return response.status(201).json({ message: 'Ficha creada!', chipCreated })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo crear la ficha!' })
    }
  }

  public getAllChips = async ({ response }: HttpContext) => {
    try {
      const chips = await this.chipUseCase.getAllChips()
      if (chips.length === 0)
        return response
          .status(404)
          .json({ error: 'No se encontraron chips con los parámetros especificados!' })

      return response.status(200).json({ message: 'Fichas listadas!', chips })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo realizar la consulta!' })
    }
  }
}
