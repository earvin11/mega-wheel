export interface GameEntity {
  name: string
  maxBet: number
  minBet: number
  providerId: string
  operator: string
  uuid?: string
  active?: boolean
  status?: boolean
  manualDisable?: boolean
  croupier?: string // croupiers uuid

  // !Note: Add game logic properties here
}
