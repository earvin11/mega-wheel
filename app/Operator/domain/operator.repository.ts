import { ChipEntity } from 'App/Chip/domain/chip.entity'
import { OperatorEntity } from './entities/operator.entity'
import { OperatorUrlEntity } from './entities/operatorUrl.entity'
import { UpdateOperatorEntity } from './entities/updateOperator.entity'
import { ConfigPaymentEntity, OperatorGameLimitsEntity } from './entities/operator-game-limits.entity'
// import { Operatorlimits } from './operatorLimits.entity'

export interface OperatorRepository {
  createOperator(operator: OperatorEntity): Promise<OperatorEntity>
  getAllOperators(): Promise<OperatorEntity[] | []>
  disableOperator(uuid: string): Promise<OperatorEntity | null>
  enableOperator(uuid: string): Promise<OperatorEntity | null>
  getOperatorByUuid(uuid: string): Promise<OperatorEntity | null>
  deleteOperator(uuid: string): Promise<OperatorEntity | null>
  updateOperatorUrls(uuid: string, operatorUrls: OperatorUrlEntity): Promise<OperatorEntity | null>
  updateOperator(uuid: string, dataToUpdate: UpdateOperatorEntity): Promise<OperatorEntity | null>
  getOperatorsByClient(clientUuid: string): Promise<OperatorEntity[] | []>
  // CHIPS
  assignChipsToOperator(uuid: string, chipUuid: string): Promise<OperatorEntity | null>
  showOperatorChips(uuid: string): Promise<OperatorEntity | null>
  deleteChipInOperator(uuid: string, chipUuid: string): Promise<OperatorEntity | null>
  updateChip(uuid: string, chipUuid: string,newChip): Promise<ChipEntity | null>
  addDefaultChips(uuid: string, isoCode: string): Promise<OperatorEntity | null>
  // CURRENCIES
  addCurrencyToOperator(uuid: string, currency: string) : Promise<OperatorEntity | null>
  removeCurrencyToOperator(uuid: string, currency: string) : Promise<OperatorEntity | null>
  // OPERATOR GAMES LIMITS
  addGameLimitsInOperator(uuid: string, dataGameLimit: OperatorGameLimitsEntity): Promise<OperatorEntity |null>;
  getAllGamesLimitsInOperator(uuid: string): Promise<OperatorGameLimitsEntity[] | []>;
  getGameAndLimitsInOperator(uuid: string, gameUuid: string): Promise<OperatorGameLimitsEntity | null>;
  deleteGameAndLimitsInOperator(uuid: string, gameUuid: string): Promise<OperatorEntity | null>;
  // CONFIG PAYMENTS
  addConfigPaymentInGame(uuid: string, gameUuid: string, configPayment: ConfigPaymentEntity[]): Promise<OperatorEntity | null>;
}
