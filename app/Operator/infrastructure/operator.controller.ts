import { OperatorUseCases } from '../application/OperatorUseCases'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { OperatorEntity } from '../domain/entities/operator.entity'
import { CreateAuditoryParams } from '../../Shared/Interfaces/create-auditory.interface'
import CreateAuditory from '../../Shared/Helpers/create-auditory'
import { OperatorUrlEntity } from '../domain/entities/operatorUrl.entity'
import { UpdateOperatorEntity } from '../domain/entities/updateOperator.entity'
// import { clientUseCases } from '../../Client/infrastructure/dependencies'
// import { chipUseCase } from '../../Chip/infrastructure/dependencies'
import { ChipEntity, UpdateChipEntity } from '../../Chip/domain/chip.entity'

// import { gameUseCases } from '../../Game/infrastructure/dependencies'
// import { currencyUseCases } from '../../Currencies/infrastructure/dependencies'
// import { GameUseCases } from 'App/Game/application/GameUseCases'
import { CurrencyUseCases } from 'App/Currencies/application/currencyUseCases'
import { ChipUseCases } from 'App/Chip/application/ChipUseCase'
import { ClientUseCases } from 'App/Client/application/ClientUseCases'
import { CurrencyAndLimitsEntity } from '../domain/entities'
import { WheelFortuneUseCases } from 'App/WheelFortune/apllication/wheel-fortune.use-cases'

export class OperatorController {
  constructor(
    private operatorUseCases: OperatorUseCases,
    private clientUseCases: ClientUseCases,
    private gameUseCases: WheelFortuneUseCases,
    // private gameUseCases: GameUseCases,
    private currencyUseCases: CurrencyUseCases,
    private chipUseCases: ChipUseCases
  ) {}

  public createOperator = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const {
      casinoToken,
      client,
      endpointAuth,
      endpointBet,
      endpointRollback,
      endpointWin,
      maxBet,
      minBet,
      name,
    } = request.body()

    const operators = await this.operatorUseCases.getAllOperators()
    const operatorId = operators[operators.length - 1]
      ? operators[operators.length - 1].operatorId + 1
      : 1000

    const operator: OperatorEntity = {
      casinoToken,
      client,
      endpointAuth,
      endpointBet,
      endpointRollback,
      endpointWin,
      maxBet,
      minBet,
      name,
      operatorId,
    }

    try {
      const clientExist = await this.clientUseCases.getClientByUuid(client)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const operatorCreated = await this.operatorUseCases.createOperator(operator)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Crear operador!',
        ctx,
        resource: operatorCreated.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(201).json({ message: 'Operador creado!', operator: operatorCreated })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo crear el operador!' })
    }
  }

  public getAllOperators = async ({ response }: HttpContext) => {
    try {
      const operators = await this.operatorUseCases.getAllOperators()
      if (operators.length === 0)
        return response.status(404).json({ error: 'No existen operadores registrados' })

      return response.status(200).json({ message: 'Operadores listados!', operators })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudieron obtener los operadores!' })
    }
  }

  public disableOperator = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()

    if (!uuid) return response.status(401).json({ error: 'Debe enviar el uuid del operador!' })

    try {
      const operator = await this.operatorUseCases.disableOperator(uuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Deshabilitar operador!',
        ctx,
        resource: operator.name,
      }
      await CreateAuditory(auditoryParams)

      // !Nota: Una vez cree la sección de games, agregar aquí el método para deshabilitar los juegos correspondientes a este operador.

      return response.status(200).json({ message: 'Operador deshabilitado!', operator })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo deshabilitar el operador!', error })
    }
  }

  public enableOperator = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()

    if (!uuid) return response.status(401).json({ error: 'Debe enviar el uuid del operador!' })

    try {
      const operator = await this.operatorUseCases.enableOperator(uuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Habilitar operador!',
        ctx,
        resource: operator.name,
      }
      await CreateAuditory(auditoryParams)

      // !Nota: Una vez cree la sección de games, agregar aquí el método para habilitar los juegos correspondientes a este operador.

      return response.status(200).json({ message: 'Operador habilitado!', operator })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo habilitar el operador!' })
    }
  }

  public getOperatorByUuid = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()

    try {
      const operator = await this.operatorUseCases.getOperatorByUuid(uuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      return response.status(200).json({ message: 'Operador listado!', operator })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'Ha ocurrido un error. No se pudo obtener el operador!' })
    }
  }

  public deleteOperator = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()

    try {
      const operator = await this.operatorUseCases.deleteOperator(uuid)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Eliminar operador!',
        ctx,
        resource: operator.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Operador eliminado!', operator })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'Ha ocurrido un error. No se pudo eliminar el operador!' })
    }
  }

  public updateOperatorUrls = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()
    const { endpointAuth, endpointBet, endpointWin, endpointRollback } = request.body()

    if (!endpointAuth && !endpointBet && !endpointRollback && !endpointWin)
      return response.status(401).json({ error: 'Debe enviar las URLs de actualización!' })

    const operatorUrls: OperatorUrlEntity = {
      endpointAuth,
      endpointBet,
      endpointRollback,
      endpointWin,
    }

    try {
      const operator = await this.operatorUseCases.updateOperatorUrls(uuid, operatorUrls)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Actualizar urls del operador!',
        ctx,
        resource: operator.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Urls del operador actualizadas!', operator })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'No se pudieron actualizar las URLs del operador!', err: error })
    }
  }

  public updateOperator = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid } = request.params()
    const { casinoToken, client, maxBet, minBet, name } = request.body()

    if (!casinoToken && !client && !maxBet && !minBet && !name)
      return response.status(401).json({ error: 'Debe enviar los datos de actualización!' })

    const dataToUpdate: UpdateOperatorEntity = {
      casinoToken,
      client,
      maxBet,
      minBet,
      name,
    }

    try {
      const operator = await this.operatorUseCases.updateOperator(uuid, dataToUpdate)
      if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Actualizar operador!',
        ctx,
        resource: operator.name,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Operador actualizado!', operator })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo actualizar el operador!' })
    }
  }

  public getOperatorsByClient = async ({ request, response }: HttpContext) => {
    const { clientUuid } = request.params()

    try {
      const clientExist = await this.clientUseCases.getClientByUuid(clientUuid)
      if (!clientExist) return response.status(404).json({ error: 'No se encuentra el cliente!' })

      const operators = await this.operatorUseCases.getOperatorsByClient(clientUuid)
      if (operators.length === 0)
        return response.status(404).json({ error: 'No existen operadores asociados al cliente!' })

      return response.status(200).json({ message: 'Operadores listados!', operators })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudieron obtener los operadores!' })
    }
  }

  // public assignChipsToOperator = async ({ request, response }: HttpContext) => {
  //   const { uuid } = request.params()
  //   const { chipUuid } = request.body()

  //   if (!chipUuid) return response.status(400).json({ error: 'Debe enviar el UUID de la ficha!' })

  //   try {
  //     const operatorExist = await this.operatorUseCases.getOperatorByUuid(uuid)
  //     if (!operatorExist)
  //       return response.status(404).json({ error: 'No se encuentra el operador!' })

  //     const chipExist = await this.chipUseCases.getChipByUuid(chipUuid)
  //     if (!chipExist) return response.status(404).json({ error: 'No se encuentra la ficha!' })

  //     if (operatorExist.chips?.includes(chipUuid))
  //       return response.status(400).json({ error: 'Ya existe la ficha en el operador!' })

  //     const operator = await this.operatorUseCases.assignChipsToOperator(uuid, chipUuid)

  //     return response.status(200).json({ message: 'Ficha agregada al operador!', operator })
  //   } catch (error) {
  //     return response
  //       .status(400)
  //       .json({ message: 'No se pudo agregar la ficha al operador!', error })
  //   }
  // }

  // public showOperatorChips = async ({ request, response }: HttpContext) => {
  //   const { uuid } = request.params()

  //   try {
  //     const operator = await this.operatorUseCases.showOperatorChips(uuid)
  //     if (!operator) return response.status(404).json({ error: 'No se encuentra el operador!' })

  //     const chipsUuidArray = operator.chips
  //     if (!chipsUuidArray || chipsUuidArray.length === 0)
  //       return response.status(404).json({ error: 'Este operador no tiene fichas asignadas!' })

  //     const chips: ChipEntity[] = await this.chipUseCases.getManyChips(chipsUuidArray)

  //     return response.status(200).json({ message: 'Fichas del operador listadas!', chips })
  //   } catch (error) {
  //     return response
  //       .status(400)
  //       .json({ message: 'No se pudieron obtener las fichas del operador!', error })
  //   }
  // }

  // public deleteChipInOperator = async ({ request, response }: HttpContext) => {
  //   const { uuid, chipUuid } = request.params()

  //   if (!chipUuid) return response.status(400).json({ error: 'Debe enviar el UUID de la ficha!' })

  //   try {
  //     const operatorExist = await this.operatorUseCases.getOperatorByUuid(uuid)
  //     if (!operatorExist)
  //       return response.status(404).json({ error: 'No se encuentra el operador!' })

  //     const chipExist = await this.chipUseCases.getChipByUuid(chipUuid)
  //     if (!chipExist) return response.status(404).json({ error: 'No se encuentra la ficha!' })

  //     if (!operatorExist.chips?.includes(chipUuid))
  //       return response
  //         .status(400)
  //         .json({ error: 'la ficha existe, pero no se encuentra asignada a este operador!' })

  //     const operator = await this.operatorUseCases.deleteChipInOperator(uuid, chipUuid)

  //     return response.status(200).json({ message: 'Ficha eliminada del operador!', operator })
  //   } catch (error) {
  //     return response
  //       .status(400)
  //       .json({ message: 'No se pudo eliminar la ficha del operador!', error })
  //   }
  // }

  // public addDefaultChips = async ({ request, response }: HttpContext) => {
  //   const { uuid, isoCode } = request.params()
  //   try {
  //     const operatorExist = await this.operatorUseCases.getOperatorByUuid(uuid)
  //     if (!operatorExist) return response.status(400).json({ error: 'Operador no encontrado' })

  //     const currencyExist = await this.currencyUseCases.getCurrencyByIsoCode(isoCode)
  //     if (!currencyExist) return response.status(400).json({ error: 'Currency no encontrado' })

  //     const operator = await this.operatorUseCases.addDefaultChips(uuid, isoCode)

  //     response.status(201).json({ message: 'Currencies por default agregado', operator })
  //   } catch (error) {
  //     console.log('ERROR IN ADD DEFAULT CHIPS -> OPERATOR CONTROLLER', error)
  //     response.status(400).json({ message: 'No se pudo agregar las fichas al operador!', error })
  //   }
  // }

  // public updateChip = async ({ request, response }: HttpContext) => {
  //   const { uuid, chipUuid } = request.params()
  //   const { newChip } = request.body()

  //   try {
  //     const operatorExist = await this.operatorUseCases.getOperatorByUuid(uuid)
  //     if (!operatorExist)
  //       return response.status(404).json({ error: 'No se encuentra el operador!' })

  //     const chipExist = await this.chipUseCases.getChipByUuid(chipUuid)
  //     if (!chipExist) return response.status(404).json({ error: 'No se encuentra la ficha!' })

  //     if (!operatorExist.chips?.includes(chipUuid))
  //       return response
  //         .status(400)
  //         .json({ error: 'la ficha existe, pero no se encuentra asignada a este operador!' })

  //     const chip: UpdateChipEntity = {
  //       color: newChip.color,
  //       value: newChip.value,
  //       currency: newChip.currency,
  //     }

  //     const operator = await this.operatorUseCases.updateChip(uuid, chipUuid, chip)

  //     response.status(201).json({ message: 'Chip actualizada', operator })
  //   } catch (error) {
  //     console.log('ERROR UPDATE CHIP', error)
  //     response.status(400).json({ message: 'Error actualizando la chip', error })
  //   }
  // }

  // ! CURRENCIES
  public addCurrencyToOperator = async ({ request, response }: HttpContext) => {
    const { uuid } = request.params()
    const { currency } = request.body()
    if (!currency) return response.status(401).json({ error: 'Debe enviar la moneda!' })

    try {
      const operatorExist = await this.operatorUseCases.getOperatorByUuid(uuid)
      if (!operatorExist)
        return response.status(404).json({ error: 'No se encuentra el operador!' })

      const currencyData = await this.currencyUseCases.getCurrencyByUuid(currency);
      if(!currencyData) return response.notFound({ error: 'Currency not found' });

      if (operatorExist.currencies?.includes(currencyData.isoCode))
        return response.status(400).json({ error: 'La moneda ya fue agregado el cliente!' })

      const operator = await this.operatorUseCases.addCurrencyToOperator(uuid, currencyData.isoCode)

      response.status(200).json({ message: 'Nueva moneda agregada al operador!', operator })
    } catch (error) {
      console.log('ERROR addCurrencyToOperator -> OPERATOR CONTROLLER', error)
      response.status(400).json({ error: 'Error agregando moneda al operador' })
    }
  }

  public removeCurrencyToOperator = async ({ request, response }: HttpContext) => {
    const { uuid, currency } = request.params()

    if (!currency) return response.status(401).json({ error: 'Debe enviar la moneda!' })

    try {
      const operatorExist = await this.operatorUseCases.getOperatorByUuid(uuid)
      if (!operatorExist)
        return response.status(404).json({ error: 'No se encuentra el operador!' })

      if (!operatorExist.currencies?.includes(currency))
        return response.status(400).json({ error: 'El operador no posee esta moneda!' })

      const operator = await this.operatorUseCases.removeCurrencyToOperator(uuid, currency)

      response.status(200).json({ message: 'Moneda eliminada del operador!', operator })
    } catch (error) {
      console.log('ERROR removeCurrencyToOperator -> OPERATOR CONTROLLER', error)
      response.status(400).json({ error: 'Error removiendo moneda al operador' })
    }
  }

  // GAMES AND LIMITS
  public addGameLimitsInOperator = async ({ request, response }: HttpContext) => {
    try {
      const { uuid } = request.params();
      const { gameUuid, currencyUuid, minBet, maxBet } = request.body();
    
      const operator = await this.operatorUseCases.getOperatorByUuid(uuid);
      if(!operator) return response.notFound({ error: 'operator not found' });

      const game = await this.gameUseCases.getByUuid(gameUuid);
      if(!game) return response.notFound({ error: 'game not found' });

      const currency = await this.currencyUseCases.getCurrencyByUuid(currencyUuid);
      if(!currency) return response.notFound({ error: 'currency not found' });

      const currencyAndLimits: CurrencyAndLimitsEntity[] = [
        {
          currency,
          minBet,
          maxBet
        }
      ];

      const operatorWithGameLimits = await this.operatorUseCases.addGameLimitsInOperator(uuid, {
        game,
        currencyAndLimits,
        configPayment: [],
      });

      response.ok(operatorWithGameLimits);
    } catch (error) {
      console.log('ERROR ADD GAME LIMITS IN OPERATOR', error);
      response.internalServerError({ error: 'Error agregando game and limits in operator' });
    }
  };

  // CONFIG PAYMENT
  public addConfigPaymentInGame = async ({ request, response }: HttpContext) => {
    try {
      const { uuid, gameUuid } = request.params();
      const { configPayments } = request.body();

      const resp = await this.operatorUseCases.addConfigPaymentInGame(uuid, gameUuid, configPayments);
      response.ok(resp);
    } catch (error) {
      console.log(error);
      response.internalServerError({ error: 'Error agregando game and limits in operator' });
    }
  }
}
