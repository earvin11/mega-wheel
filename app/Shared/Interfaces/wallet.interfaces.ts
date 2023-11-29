export interface PlayerWalletResponse {
  ok: boolean
  mensaje: string
  userId: string
  username: string
  lastBalance: string
  country_code: string
  email: string
  last_name: string
  currency: string
  available_balance: string
  WL?: string
  msg?: string
}

export interface DebitWalletRequest {
  user_id: string
  amount: number
  round_id: string
  bet_id: string
  game_id: string
  bet_code: string
  bet_date: string
  platform: string
  currency: string
  transactionType: string
  allow_multiple_transactions?: boolean
}

export interface CreditWalletRequest {
  user_id: string
  amount: number
  round_id: string
  bet_id: string
  game_id: string
  bet_code: string
  bet_date: string
  platform: string
  currency: string
  transactionType: string
}
