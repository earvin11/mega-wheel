export interface ChipEntity {
  value: number
  color: ChipColor
  currency: string
  status?: boolean
  uuid?: string
  operator: string
}

export interface ChipColor {
  primary: string
  secondary: string
}

export interface UpdateChipEntity extends Omit<ChipEntity,'status' | 'uuid' | 'operator'>{}