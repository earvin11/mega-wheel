import { Jackpot, RoundEntity, RoundRepository } from '../../domain';
import RoundModel from '../round.model';

export class RoundMongoRepository implements RoundRepository {
  public createRound = async (round: RoundEntity): Promise<RoundEntity> => {
    try {
      const newRound = await RoundModel.create(round);
      return newRound;
    } catch (error) {
      throw error;
    }
  }
  public findRounds = async (): Promise<RoundEntity[] | []> => {
    try {
      const rounds = await RoundModel.find();
      return rounds;
    } catch (error) {
      throw error;
    }
  }
  public findRoundByUuid = async (uuid: string): Promise<RoundEntity | null> => {
    try {
      const round = await RoundModel.findOne({ uuid });
      if (!round) return null;
      return round;
    } catch (error) {
      throw error;
    }
  }
  public findRoundsByProviderId = async (providerId: string): Promise<RoundEntity[] | []> => {
    try {
      const rounds = await RoundModel.find({ providerId });
      return rounds;
    } catch (error) {
      throw error;
    }
  }
  public closeBetsInRound = async (uuid: string): Promise<RoundEntity | null> => {
    try {
      const roundBetsClosed = await RoundModel.findOneAndUpdate({ uuid }, { open: false }, { new: true });
      return roundBetsClosed;
    } catch (error) {
      throw error;
    }
  }
  public setJackpotInRound = async (uuid: string, jackpotValue: Jackpot): Promise<RoundEntity | null> => {
    try {
      const roundWithJackpot = await RoundModel.findOneAndUpdate({ uuid }, { jackpot: jackpotValue }, { new: true });
      return roundWithJackpot;
    } catch (error) {
      throw error;
    }
  }

  public closeRound = async (uuid: string, result: number): Promise<RoundEntity | null> => {
    try {
      const roundClosed = await RoundModel.findOneAndUpdate({ uuid }, { result, providerId: '999' }, { new: true });
      if (!roundClosed) return null;
      return roundClosed;
    } catch (error) {
      throw error;
    }
  }

  public closeRounds = async (providerId: string, result: number): Promise<any> => {
    try {
      const roundsClosed = await RoundModel.updateMany({ providerId }, { result, providerId: '999' });
      return roundsClosed
    } catch (error) {
      throw error;
    }
  }
  public createManyRounds = async (rounds: RoundEntity[]): Promise<RoundEntity[]> => {
    try {
      const insertPromises: any[] = [];
      rounds.forEach(round => {
        insertPromises.push(this.createRound(round))
      });

      const roundsCreated = await Promise.all(insertPromises);
      return roundsCreated;
    } catch (error) {
      throw error;
    }
  }
};