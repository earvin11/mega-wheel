export interface WheelFortuneEntity {
  name: string
  providerId: string
  uuid?: string
  active?: boolean
  status?: boolean
  manualDisable?: boolean
  croupier?: string // croupiers uuid

  // !Note: Add game logic properties here
  betTime: number
  jackpot: boolean
  imgBackground: string
  urlTransmision: string
  colorBackground: string
  logo: string
  language: string
  type?: string
  launchUrl: string
  percentReturnToPlayer: number
  betPays: BetPay[]
}

export interface BetPay {
  number: number
  multiplier: number
}

export type UpdateWheelDto = Pick<
  WheelFortuneEntity,
  'imgBackground' | 'providerId' | 'urlTransmision' | 'name' | 'logo' | 'betPays' | 'betTime' | 'launchUrl'
>
