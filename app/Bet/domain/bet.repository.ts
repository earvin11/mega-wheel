import { BetEntity } from './bet.entity'

export interface BetRepository {
  createBet(bet: BetEntity): Promise<BetEntity>
  getWinner(filter: any): Promise<BetEntity | null>
  getWinners(filter: any): Promise<BetEntity[] | []>
  findAllBets(): Promise<BetEntity[] | []>
  findBetByUuid(uuid: string): Promise<BetEntity | null>
  payBet(uuid: string): Promise<BetEntity | null>
  findBetsByRoundUuid(roundUuid: string): Promise<BetEntity[] | []>
}
