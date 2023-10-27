import { ChipRepository } from '../domain/chip.repository'
import { ChipEntity } from '../domain/chip.entity'
import { Chip } from '../domain/chip.value'

export class ChipUseCases {
  constructor(private readonly chipRepository: ChipRepository) {}

  public createChip = async (chip: ChipEntity) => {
    const newChip = new Chip(chip)
    const chipCreated = await this.chipRepository.createChip(newChip)
    return chipCreated
  }

  public getAllChips = async () => {
    const chips = await this.chipRepository.getAllChips()
    return chips
  }

  public getChipByUuid = async (uuid: string) => {
    const chip = await this.chipRepository.getChipByUuid(uuid)
    return chip
  }

  public getManyChips = async (chipsUuid: string[]) => {
    const chips = await this.chipRepository.getManyChips(chipsUuid)
    return chips
  }
}
