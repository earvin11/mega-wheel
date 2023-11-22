import { defualtChipsToSave } from 'App/Shared/Values/default-chips'
import ChipModel from '../../Chip/infrastructure/chip.model'
import { ChipEntity } from '../domain/chip.entity'
import { ChipRepository } from '../domain/chip.repository'

export class MongoChipRepository implements ChipRepository {
  public createChip = async (chip: ChipEntity): Promise<ChipEntity> => {
    const chipCreated = await ChipModel.create(chip)
    return chipCreated
  }

  public getAllChips = async (): Promise<ChipEntity[] | []> => {
    const logs = await ChipModel.find().exec()
    return logs
  }

  public getChipByUuid = async (uuid: string): Promise<ChipEntity | null> => {
    const chip = await ChipModel.findOne({ uuid }).exec()
    if (!chip) return null

    return chip
  }

  public getManyChips = async (chipsUuid: string[]): Promise<ChipEntity[]> => {
    const chips = await ChipModel.find({ uuid: { $in: chipsUuid } }).exec()
    return chips
  }

  public getChipsByOperator = async (operatorUuid: string, isoCode?: string): Promise<ChipEntity[] | []> => {
    const filter = { operator: operatorUuid };
    if(isoCode) filter['currency'] = isoCode;
    try {
      const chips = await ChipModel.find(filter);
      if(!chips) return [];
      
      return chips;
    } catch (error) {
      throw error;
    }
  }

  public addDefaultChips = async (
    operatorUuid: string,
    isoCode: string,
  ): Promise<ChipEntity[]> => {
    try {
      await ChipModel.deleteMany({ operator: operatorUuid, currency: isoCode });
  
      let data: any
      data = defualtChipsToSave[isoCode]
      if (!data) data = defualtChipsToSave['default']
  
      const promisesChips = data.map(async (data: any) => {
        const chips = {
          currency: isoCode,
          operator: operatorUuid,
          ...data,
        }
        const chip = await this.createChip(chips)
        return chip
      })
  
      const chips = await Promise.all([...promisesChips]);
      return chips;
      
    } catch (error) {
      throw error;      
    }
  }
}
