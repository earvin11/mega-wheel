import Redis from '@ioc:Adonis/Addons/Redis'
import { BetEntity } from '../domain/bet.entity'
import { BetRepository } from '../domain/bet.repository'
import betModel from './bet.model'

export class BetMongoRepository implements BetRepository {
  private BET_KEY = (roundId: string) => `bets:${roundId}`
  public createBet = async (bet: BetEntity): Promise<BetEntity> => {
    const betCreated = await betModel.create(bet)
    return betCreated
  }
  public getWinner = async (filter: any): Promise<BetEntity | null> => {
    const betWinner = await betModel.findOne({ ...filter })
    if (!betWinner) {
      return null
    }
    return betWinner
  }
  public getWinners = async (filter: any): Promise<BetEntity[] | []> => {
    const betWinners = await betModel.find({ ...filter })
    if (!betWinners) {
      return []
    }
    return betWinners
  }
  public findAllBets = async (): Promise<BetEntity[] | []> => {
    const bets = await betModel.find()
    if (!bets) {
      return []
    }
    return bets
  }
  public findBetByUuid = async (uuid: string): Promise<BetEntity | null> => {
    const bet = await betModel.findOne({ uuid })
    if (!bet) {
      return null
    }
    return bet
  }
  public payBet = async (uuid: string): Promise<BetEntity | null> => {
    // TODO: idk do something here :)
    const bet = await betModel.findOne({ uuid })
    if (!bet) {
      return null
    }
    return bet
  }

  public setBet = async (bet: BetEntity): Promise<void> => {
    const { roundUuid } = bet
    const key = this.BET_KEY(roundUuid!)
    const betsString = await Redis.get(key)
    const betsData: BetEntity[] = betsString ? JSON.parse(betsString as string) : []
    betsData.push(bet)
    await Redis.set(key, JSON.stringify(betsData))
  }
}
