export interface SearchUserEntity {
  clientId?: string
  operatorId?: string
  fromDate?: string
  toDate?: string
  page: number
  limit: number
}
