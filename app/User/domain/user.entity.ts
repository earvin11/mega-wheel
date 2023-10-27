export interface UserEntity {
  name: string
  lastName: string
  userName: string
  email: string
  password: string
  client: string
  userClient?: boolean
  rol: string
  uuid?: string
  currencies?: string[]
  operator?: string
  status: boolean
  tokenWallet?: string
}
