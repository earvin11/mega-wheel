export interface SearchTickets {
  operator?: string
  fromDate?: string
  toDate?: string
  playerEmail?: string
  page: number
  limit: number
}
