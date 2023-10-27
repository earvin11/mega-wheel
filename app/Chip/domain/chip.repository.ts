import { ChipEntity } from './chip.entity'

export interface ChipRepository {
  createChip(chip: ChipEntity): Promise<ChipEntity>
  getAllChips(): Promise<ChipEntity[] | []>
  getChipByUuid(uuid: string): Promise<ChipEntity | null>
  getManyChips(chipsUuid: string[]): Promise<ChipEntity[]>
}
