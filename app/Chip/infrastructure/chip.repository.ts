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
}
