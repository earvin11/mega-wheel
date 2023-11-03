import { Jackpot, Round, RoundEntity, RoundRepository } from '../domain';

export class RoundUseCases {
  constructor(
    private roundRepository: RoundRepository
  ) { };

  public createRound = async (round: RoundEntity) => {
    try {
      const newRound = new Round(round);
      const roundCreated = await this.roundRepository.createRound(newRound);
      return roundCreated;
    } catch (error) {
      throw error;
    };
  };

  public findRounds = async () => {
    try {
      return await this.roundRepository.findRounds();
    } catch (error) {
      throw error;
    };
  };

  public findRoundByUuid = async (uuid: string) => {
    try {
      const round = await this.roundRepository.findRoundByUuid(uuid);
      return round;
    } catch (error) {
      throw error;
    };
  };

  public findRoundsByProviderId = async (providerId: string) => {
    try {
      const round = await this.roundRepository.findRoundsByProviderId(providerId);
      return round;
    } catch (error) {
      throw error;
    };
  };

  public closeBetsIndRound = async (uuid: string) => {
    try {
      const round = await this.roundRepository.closeBetsInRound(uuid);
      return round;
    } catch (error) {
      throw error;
    };
  };

  public setJackpotInRound = async (uuid: string, jackpotValue: Jackpot) => {
    try {
      const round = await this.roundRepository.setJackpotInRound(uuid, jackpotValue);
      return round;
    } catch (error) {
      throw error;
    }
  };

  public closeRound = async (uuid: string, result: number) => {
    try {
      const roundClosed = await this.roundRepository.closeRound(uuid, result);
      return roundClosed;
    } catch (error) {
      throw error;
    };
  };
  public closeRounds = async (providerId: string, result: number) => {
    try {
      const roundsClosed = await this.roundRepository.closeRounds(providerId, result);
      return roundsClosed
    } catch (error) {
      throw error;
    }
  }
  public createManyRounds = async (rounds: RoundEntity[]) => {
    try {
      const newRounds: any[] = [];
       rounds.forEach(round => {
        newRounds.push(this.createRound(round))
      });
      const roundsCreated = await this.roundRepository.createManyRounds(newRounds);
      return roundsCreated;
    } catch (error) {
      throw error;
    }
  }
}