import { WheelFortuneEntity, UpdateWheelDto } from "../domain/wheel-fortune.entity";
import { WheelFortuneRepository } from "../domain/wheel-fortune.repository";
import GameModel from "./wheelFortune.model";

export class WheelFortuneMongoRepository implements WheelFortuneRepository {
  public create = async (wheelFortune: WheelFortuneEntity): Promise<WheelFortuneEntity> => {
    try {
      const newWheelGame = await GameModel.create(wheelFortune);
      return newWheelGame;
    } catch (error) {
      throw error;
    }
  }
  public getAll = async (): Promise<WheelFortuneEntity[]> => {
    try {
      const allWheel = await GameModel.find();
      return allWheel;
    } catch (error) {
      throw error;
    };

  }
  public getByUuid = async (uuid: string): Promise<WheelFortuneEntity | null> => {
    try {
      const game = await GameModel.findOne({ uuid });
      return game;
    } catch (error) {
      throw error;
    }
  }
  public updateByUuid = async (uuid: string, updateWheelDto: UpdateWheelDto): Promise<WheelFortuneEntity | null> => {
    throw new Error("Method not implemented.");
  }
  public deleteByUuid = async (uuid: string): Promise<WheelFortuneEntity | null> => {
    try {
      const wheelDeleted = await GameModel.findOneAndUpdate({ uuid }, { status: false }, { new: true });
      if (!wheelDeleted) return null;
      return wheelDeleted
    } catch (error) {
      throw error;
    }
  }
  public getManyByProviderId = async (providerId: string): Promise<WheelFortuneEntity[] | []> => {
    try {
      const wheels = await GameModel.find({ providerId: providerId, status: true, type: 'WHEEL' });
      if (!wheels) return [];
      return wheels;
    } catch (error) {
      throw error;
    }
  }
}