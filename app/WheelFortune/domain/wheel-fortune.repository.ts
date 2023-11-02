import { UpdateWheelDto, WheelFortuneEntity } from "./wheel-fortune.entity";

export interface WheelFortuneRepository {
  create(wheelFortune: WheelFortuneEntity): Promise<WheelFortuneEntity>;
  getAll(): Promise<WheelFortuneEntity[]>;
  getManyByProviderId(providerId: string): Promise<WheelFortuneEntity[]>;
  getByUuid(uuid: string): Promise<WheelFortuneEntity | null>;
  updateByUuid(uuid: string, updateWheelDto: UpdateWheelDto): Promise<WheelFortuneEntity>;
  deleteByUuid(uuid: string): Promise<WheelFortuneEntity>;
};