import { OperatorEntity, OperatorGameLimitsEntity, UpdateOperatorEntity, OperatorUrlEntity, ConfigPaymentEntity } from '../domain/entities'
import { OperatorRepository } from '../domain/operator.repository'
import OperatorModel from './operator.model'
// import { defualtChipsToSave } from '../../Shared/Values/default-chips'
// import ChipModel from '../../Chip/infrastructure/chip.model'
// import { ChipEntity } from '../../Chip/domain/chip.entity'
// import { ChipUseCases } from 'App/Chip/application/ChipUseCase'
import { Operator } from '../domain/implementations'

export class OperatorMongoRepository implements OperatorRepository {
  constructor(
    // private chipUseCases: ChipUseCases
  ) {}
  public createOperator = async (operator: OperatorEntity): Promise<OperatorEntity> => {
    const operatorCreated = await OperatorModel.create(operator)
    return operatorCreated
  }

  public getAllOperators = async (): Promise<OperatorEntity[] | []> => {
    const operators = await OperatorModel.find().exec()
    return operators
  }

  public disableOperator = async (uuid: string): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate(
      { uuid },
      { available: false },
      { new: true },
    ).exec()
    if (!operator) return null

    return operator
  }

  public enableOperator = async (uuid: string): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate(
      { uuid },
      { available: true },
      { new: true },
    ).exec()
    if (!operator) return null

    return operator
  }

  public getOperatorByUuid = async (uuid: string): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOne({ uuid }).exec()
    if (!operator) return null

    return operator
  }

  public deleteOperator = async (uuid: string): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate(
      { uuid },
      { status: false },
      { new: true },
    ).exec()
    if (!operator) return null

    return operator
  }

  public updateOperatorUrls = async (
    uuid: string,
    operatorUrls: OperatorUrlEntity,
  ): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate({ uuid }, operatorUrls, {
      new: true,
    }).exec()
    if (!operator) return null

    return operator
  }

  public updateOperator = async (
    uuid: string,
    dataToUpdate: UpdateOperatorEntity,
  ): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate({ uuid }, dataToUpdate, {
      new: true,
    }).exec()
    if (!operator) return null

    return operator
  }

  public getOperatorsByClient = async (clientUuid: string): Promise<OperatorEntity[] | []> => {
    const operators = await OperatorModel.find({ client: clientUuid }).exec()
    return operators
  }

  // public assignChipsToOperator = async (
  //   uuid: string,
  //   chipUuid: string,
  // ): Promise<OperatorEntity | null> => {
  //   const operator = await OperatorModel.findOneAndUpdate(
  //     { uuid },
  //     { $push: { chips: chipUuid } },
  //     { new: true },
  //   ).exec()
  //   if (!operator) return null

  //   return operator
  // }

  // public showOperatorChips = this.getOperatorByUuid

  // public deleteChipInOperator = async (
  //   uuid: string,
  //   chipUuid: string,
  // ): Promise<OperatorEntity | null> => {
  //   const operator = await OperatorModel.findOneAndUpdate(
  //     { uuid },
  //     { $pull: { chips: chipUuid } },
  //     { new: true },
  //   ).exec()
  //   if (!operator) return null

  //   return operator
  // }

  // public updateChip = async (
  //   uuid: string,
  //   chipUuid: string,
  //   newChip: any,
  // ): Promise<ChipEntity | null> => {
  //   const chip = await ChipModel.findOneAndUpdate(
  //     {
  //       operator: uuid,
  //       uuid: chipUuid,
  //     },
  //     {
  //       ...newChip,
  //     },
  //     {
  //       new: true,
  //     },
  //   )

  //   if (!chip) return null

  //   return chip
  // }

  // public addDefaultChips = async (
  //   uuid: string,
  //   isoCode: string,
  // ): Promise<OperatorEntity | null> => {
    // const chipsOperator = await this.showOperatorChips(uuid)

    // const chipsData = await this.chipUseCases.getManyChips(chipsOperator?.chips as string[])

    // const chipsToRemove = chipsData.filter((ch) => ch.currency !== isoCode).map((ch) => ch.uuid)

    // const removeChipsInOperator = await OperatorModel.findOneAndUpdate(
    //   { uuid },
    //   {
    //     chips: chipsToRemove,
    //   },
    //   { new: true },
    // )

    // if (!removeChipsInOperator) return null

    // const deletedChips = await ChipModel.deleteMany({ currency: isoCode, operator: uuid })

    // if (!deletedChips) return null

    // let data: any
    // data = defualtChipsToSave[isoCode]
    // if (!data) data = defualtChipsToSave['default']

    // const promisesChips = data.map(async (data: any) => {
    //   const chips = {
    //     currency: isoCode,
    //     operator: uuid,
    //     ...data,
    //   }
    //   const chip = await this.chipUseCases.createChip(chips)
    //   return chip
    // })

    // const chips = await Promise.all([...promisesChips])

    // const ids = chips.map((ch) => ch.uuid)

    // const operator = await OperatorModel.findOneAndUpdate(
    //   {
    //     uuid,
    //   },
    //   {
    //     $push: { chips: { $each: ids } },
    //   },
    //   {
    //     new: true,
    //   },
    // )

    // if (!operator) return null

    // return operator
  //}

  // CURRENCIES
  public addCurrencyToOperator = async (
    uuid: string,
    currency: string,
  ): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate(
      { uuid },
      { $push: { currencies: currency } },
      { new: true },
    ).exec()
    if (!operator) return null

    return operator
  }

  public removeCurrencyToOperator = async (
    uuid: string,
    currency: string,
  ): Promise<OperatorEntity | null> => {
    const operator = await OperatorModel.findOneAndUpdate(
      { uuid },
      { $pull: { currencies: currency } },
      { new: true },
    ).exec()

    if (!operator) return null

    return operator
  }

  // GAMES AND LIMITS
  public addGameLimitsInOperator = async (uuid: string, dataGameLimit: OperatorGameLimitsEntity): Promise<OperatorEntity | null> => {
    try {
      const operator = await this.getOperatorByUuid(uuid);
      if (!operator) return null

      const operatorUpdate = new Operator(operator);
      const data = operatorUpdate.addOperatorGamesLimits(dataGameLimit);

      await OperatorModel.updateOne({uuid}, { operatorGamesLimits: data });
      return operator;
    } catch (error) {
      throw error;
    }
  }
  public getAllGamesLimitsInOperator = async (uuid: string): Promise<OperatorGameLimitsEntity[] | []> => {
    try {
      const operator = await this.getOperatorByUuid(uuid);
      if(!operator) return [];
      if(!operator.operatorGamesLimits) return [];
      return operator.operatorGamesLimits;
    } catch (error) {
      throw error;
    }
  }
  public getGameAndLimitsInOperator = async ({ uuid, operator, gameUuid }: { uuid?: string; operator?: OperatorEntity; gameUuid: string }): Promise<OperatorGameLimitsEntity | null> => {
    
    let operatorData: OperatorEntity | null = null;
    if(operator) {
      operatorData = operator
    };

    try {
      if(!operatorData && uuid) {
        operatorData = await this.getOperatorByUuid(uuid)
      }
      if(!operatorData) return null;

      const gameAndLimit = operatorData.operatorGamesLimits?.find( gameLimit => ( gameLimit.game.uuid === gameUuid ));
      if(!gameAndLimit) return null;

      return gameAndLimit;
    } catch (error) {
      throw error;
    }
  }
  public deleteGameAndLimitsInOperator = (uuid: string, gameUuid: string): Promise<OperatorEntity | null> => {
    throw new Error('Method not implemented');
  }
  //CONFIG PAYMENT
  public addConfigPaymentInGame = async (
    uuid: string,
    gameUuid: string,
    configPayment: ConfigPaymentEntity[]
  ): Promise<OperatorEntity | null> => {
    try {
      const operator = await this.getOperatorByUuid(uuid);
      if(!operator) return null;

      const operatorUpdate = new Operator(operator);

      const data = operatorUpdate.addConfigPaymentByGame(gameUuid, configPayment);
      if(!data) return null;

      await OperatorModel.updateOne({uuid}, { operatorGamesLimits: data });
      return operator;
    } catch (error) {
      throw error;
    }  
  }
}
