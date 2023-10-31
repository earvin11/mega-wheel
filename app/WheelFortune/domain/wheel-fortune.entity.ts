export interface WheelFortuneEntity {
  name: string
  providerId: string
  uuid?: string
  active?: boolean
  status?: boolean
  manualDisable?: boolean
  croupier?: string // croupiers uuid

  // !Note: Add game logic properties here
  betTime: number;
  jackpot: boolean;
  imgBackgrout: string;
  urlTransmision: string;
  colorBackground: string;
  logo: string;
  language: string;
};

export type UpdateWheelDto = Pick<WheelFortuneEntity, 'imgBackgrout' | 'providerId' | 'urlTransmision'>;