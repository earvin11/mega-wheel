import { CurrencyEntity } from "App/Currencies/domain/currency.entity";
// import { GameEntity } from "App/Game/domain/game.entity";

export interface OperatorGameLimitsEntity {
  game:  any; //GameEntity;
  currencyAndLimits: CurrencyAndLimitsEntity[];
  uuid?: string;
  configPayment?: ConfigPaymentEntity[];
};

export interface CurrencyAndLimitsEntity {
  minBet: number;
  maxBet: number;
  currency: CurrencyEntity;
};

export interface ConfigPaymentEntity {
  optionBet: string;
  pay: number;
};

// export interface BetLimits extends Pick<OperatorLimits, 'maxBet' | 'minBet'> { }