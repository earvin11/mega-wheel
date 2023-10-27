import { OperatorRepository } from '../domain/operator.repository'
import { OperatorEntity, OperatorUrlEntity, OperatorGameLimitsEntity, UpdateOperatorEntity, ConfigPaymentEntity } from '../domain/entities'
import { Operator, OperatorGameLimits } from '../domain/implementations'

export class OperatorUseCases {
  constructor(private readonly operatorRepository: OperatorRepository) {}

  public createOperator = async (operator: OperatorEntity) => {
    const newOperator = new Operator(operator)
    const operatorCreated = await this.operatorRepository.createOperator(newOperator)

    return operatorCreated
  }

  public getAllOperators = async () => {
    const operators = await this.operatorRepository.getAllOperators()
    return operators
  }

  public disableOperator = async (uuid: string) => {
    const operator = await this.operatorRepository.disableOperator(uuid)
    return operator
  }

  public enableOperator = async (uuid: string) => {
    const operator = await this.operatorRepository.enableOperator(uuid)
    return operator
  }

  public getOperatorByUuid = async (uuid: string) => {
    const operator = await this.operatorRepository.getOperatorByUuid(uuid)
    return operator
  }

  public deleteOperator = async (uuid: string) => {
    const operator = await this.operatorRepository.deleteOperator(uuid)
    return operator
  }

  public updateOperatorUrls = async (uuid: string, operatorUrl: OperatorUrlEntity) => {
    const operator = await this.operatorRepository.updateOperatorUrls(uuid, operatorUrl)
    return operator
  }

  public updateOperator = async (uuid: string, dataToUpdate: UpdateOperatorEntity) => {
    const operator = await this.operatorRepository.updateOperator(uuid, dataToUpdate)
    return operator
  }

  public getOperatorsByClient = async (clientUuid: string) => {
    const operators = await this.operatorRepository.getOperatorsByClient(clientUuid)
    return operators
  }

  public assignChipsToOperator = async (uuid: string, chipUuid: string) => {
    const operator = await this.operatorRepository.assignChipsToOperator(uuid, chipUuid)
    return operator
  }

  public showOperatorChips = this.getOperatorByUuid

  public deleteChipInOperator = async (uuid: string, chipUuid: string) => {
    const operator = await this.operatorRepository.deleteChipInOperator(uuid, chipUuid)
    return operator
  }

  public updateChip = async (uuid: string, chipUuid: string,newChip) => {
    const operator = await this.operatorRepository.updateChip(uuid, chipUuid,newChip)
    return operator
  }

  public addDefaultChips = async (uuid: string, isoCode: string) => {
    const operator = await this.operatorRepository.addDefaultChips(uuid, isoCode)
    return operator
  }

  // CURRENCIES

  public addCurrencyToOperator = async (uuid: string, currency: string) => {
    const operator = await this.operatorRepository.addCurrencyToOperator(uuid, currency)
    return operator
  }
  
  public removeCurrencyToOperator = async (uuid: string, currency: string) => {
    const operator = await this.operatorRepository.removeCurrencyToOperator(uuid, currency)
    return operator  
  }

  // GAMES AND LIMITS
  public addGameLimitsInOperator = async (uuid: string, dataGameLimit: OperatorGameLimitsEntity): Promise<OperatorEntity | null> => {
    try {
      const newGameLimitInOperator = new OperatorGameLimits(dataGameLimit);
      const operatorUpdated = await this.operatorRepository.addGameLimitsInOperator(uuid, newGameLimitInOperator);
      return operatorUpdated;
    } catch (error) {
      throw error;
    }
  }
  public getAllGamesLimitsInOperator = async (uuid: string): Promise<[] | OperatorGameLimitsEntity[]> => {
    try {
      const operatorGamesLimits = await this.operatorRepository.getAllGamesLimitsInOperator(uuid);
      return operatorGamesLimits;
    } catch (error) {
      throw error;
    }
  }
  public getGameAndLimitsInOperator = async (uuid: string, gameUuid: string): Promise<OperatorGameLimitsEntity | null> => {
    try {
      const operatorGameLimit = await this.operatorRepository.getGameAndLimitsInOperator(uuid, gameUuid);
      return operatorGameLimit;
    } catch (error) {
      throw error;
    }
  }
  public deleteGameAndLimitsInOperator = (uuid: string, gameUuid: string): Promise<OperatorEntity | null> => {
    throw new Error('Method not implemented');
  }
  // CONFIG PAYMENT
  public addConfigPaymentInGame = async (uuid: string, gameUuid: string, configPayment: ConfigPaymentEntity[]) => {
    try {
      const operator = await this.operatorRepository.addConfigPaymentInGame(uuid, gameUuid, configPayment);
      return operator;
    } catch (error) {
      throw error;
    };
  }
}
