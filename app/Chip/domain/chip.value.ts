import { ChipColor, ChipEntity } from './chip.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Chip implements ChipEntity {
  public value: number
  public color: ChipColor
  public status: boolean
  public uuid: string
  public currency: string
  public operator: string

  constructor(chip: ChipEntity) {
    const { uuid } = new GenerateId()
    this.value = chip.value
    this.color = chip.color
    this.status = true
    this.currency = chip.currency
    this.uuid = uuid
    this.operator = chip.operator
  }
}
