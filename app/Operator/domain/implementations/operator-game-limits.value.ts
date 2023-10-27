import { GameEntity } from "App/Game/domain/game.entity";
import { ConfigPaymentEntity, CurrencyAndLimitsEntity, OperatorGameLimitsEntity } from "../entities/operator-game-limits.entity";
import { GenerateId } from "App/Shared/Helpers/generate-id.helpers";

export class OperatorGameLimits implements OperatorGameLimitsEntity {
    public game: GameEntity;
    public currencyAndLimits: CurrencyAndLimitsEntity[];
    public uuid?: string;
    public configPayment: ConfigPaymentEntity[];

    constructor(operatorGameLimits: OperatorGameLimitsEntity) {
        this.uuid = new GenerateId().uuid;
        this.currencyAndLimits = operatorGameLimits.currencyAndLimits;
        this.configPayment = operatorGameLimits.configPayment || [];
        this.game = operatorGameLimits.game;
    };
};