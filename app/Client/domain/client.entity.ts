export interface ClientEntity {
  name: string
  endpointAuth: string
  endpointRollback: string
  endpointBet: string
  endpointWin: string
  logo?: string
  loaderLogo?: string
  uuid?: string
  status?: boolean
  available?: boolean
  useLogo?: boolean
  games?: string[]
  currencies?: string[]
}

export interface UpdateClientEntity extends Pick<ClientEntity,
  'name'
  | 'endpointAuth'
  | 'endpointRollback'
  | 'endpointBet'
  | 'endpointWin'
  >{ }