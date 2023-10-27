import { UpdateWheelDto, WheelFortuneEntity } from "../domain/wheel-fortune.entity";
import { WheelFortuneRepository } from "../domain/wheel-fortune.repository";
import { WheelForune } from "../domain/wheel-fortune.value";

export class WheelFortuneUseCases {
    constructor(
        private readonly wheelFortuneRepository: WheelFortuneRepository
    ) {};

    public create = async (wheelFortune: WheelFortuneEntity) => {
        try {
          const newWheel = new WheelForune(wheelFortune);
          const wheelCreated =  await this.wheelFortuneRepository.create(newWheel);
          return wheelCreated;
        } catch (error) {
            throw error;
        };
    };
    public getAll = async () => {
        try {
          const wheels = await this.wheelFortuneRepository.getAll();
          return wheels;  
        } catch (error) {
            throw error;
        };
    };
    public getByUuid = async (uuid: string) => {
        try {
            const wheel = await this.wheelFortuneRepository.getByUuid(uuid);
            return wheel
        } catch (error) {
            throw error;
        };
    };
    public updateByUuid = async (uuid: string, updateWheelDto: UpdateWheelDto) => {
        try {
            return await this.wheelFortuneRepository.updateByUuid(uuid, updateWheelDto);
        } catch (error) {
            throw error;
        }
    };
    public deleteByUuid = async (uuid: string) => {
        try {
            return await this.wheelFortuneRepository.deleteByUuid(uuid);
        } catch (error) {
            throw error;
        }
    }
}