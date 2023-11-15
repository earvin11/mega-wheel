import Redis from '@ioc:Adonis/Addons/Redis'
import { BetEntity } from '../../domain/bet.entity'
import { BetRepository } from '../../domain/repositories/bet.repository'
import BetModel from '../bet.model'

export class BetMongoRepository implements BetRepository {
  private BET_KEY = (roundId: string) => `bets:${roundId}`
  public createBet = async (bet: BetEntity): Promise<BetEntity> => {
    const betCreated = await BetModel.create(bet)
    return betCreated
  }
  public getWinner = async (filter: any): Promise<BetEntity | null> => {
    const betWinner = await BetModel.findOne({ ...filter })
    if (!betWinner) {
      return null
    }
    return betWinner
  }
  public getWinners = async (filter: any): Promise<BetEntity[] | []> => {
    const betWinners = await BetModel.find({ ...filter })
    if (!betWinners) {
      return []
    }
    return betWinners
  }
  public findAllBets = async (): Promise<BetEntity[] | []> => {
    const bets = await BetModel.find()
    if (!bets) {
      return []
    }
    return bets
  }
  public findBetByUuid = async (uuid: string): Promise<BetEntity | null> => {
    const bet = await BetModel.findOne({ uuid })
    if (!bet) {
      return null
    }
    return bet
  }
  public payBet = async (uuid: string): Promise<BetEntity | null> => {
    // TODO: idk do something here :)
    const bet = await BetModel.findOne({ uuid })
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
  public findBetsByRoundUuid = async (roundUuid: string): Promise<BetEntity[] | []> => {
    try {
      const bets = await BetModel.aggregate([
        {
          $match: {
            roundUuid,
          },
        },
      ])
      if (!bets) return []
      return bets
    } catch (error) {
      throw error
    }
  }
}
