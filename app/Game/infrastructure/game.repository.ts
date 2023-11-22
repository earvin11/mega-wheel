// import DragonTigerModel from '../../Dragon-tiger/infrastructure/dragonTiger.model'
import { GameEntity } from '../domain/game.entity'
import { GameRepository } from '../domain/game.repository'
import { GameLimits } from '../domain/limits.entity'
import { UpdateGameEntity } from '../domain/updateGame.entity'
import GameModel from './game.model'
import GameModelWheel from '../../WheelFortune/infraestructure/wheelFortune.model'
import { WheelFortuneEntity } from 'App/WheelFortune/domain/wheel-fortune.entity'

export class GameMongoRepository implements GameRepository {

  public getGameByUuid(uuid: string): Promise<GameEntity | null> {
    throw new Error('Method not implemented.')
  }
  public createGame = async (game: GameEntity): Promise<GameEntity> => {
    const gameCreated = await GameModel.create(game)
    return gameCreated
  }

  // public getGameByUuid = async (uuid: string): Promise<GameEntity | null> => {
  //   const game = await DragonTigerModel.findOne({ uuid }).exec()
  //   if (!game) return null
  //   return game
  // }

  public getAllGames = async (): Promise<GameEntity[] | WheelFortuneEntity[] | []> => {
    const games = await GameModelWheel.find({ status: true, type: 'WHEEL' }).exec()
    return games
  }

  public updateGame = async (
    uuid: string,
    dataToUpdate: UpdateGameEntity,
  ): Promise<GameEntity | null> => {
    const game = await GameModel.findOneAndUpdate({ uuid }, dataToUpdate, { new: true }).exec()
    if (!game) return null

    return game
  }

  public deleteGame = async (uuid: string): Promise<GameEntity | null> => {
    const game = await GameModel.findOneAndUpdate(
      { uuid },
      { active: false, status: false },
      { new: true },
    ).exec()
    if (!game) return null

    return game
  }

  public addOperatorToGame = async (
    uuid: string,
    operatorUuid: string,
  ): Promise<GameEntity | null> => {
    const game = await GameModel.findOneAndUpdate(
      { uuid },
      { operator: operatorUuid },
      { new: true },
    ).exec()
    if (!game) return null

    return game
  }

  public getGameByOperator = async (operatorUuid: string): Promise<GameEntity | null> => {
    const game = await GameModel.findOne({ operator: operatorUuid }).exec()
    if (!game) return null

    return game
  }

  public updateOperatorInGame = this.addOperatorToGame

  public addCroupierToGame = async (
    uuid: string,
    croupierUuid: string,
  ): Promise<GameEntity | null> => {
    const game = await GameModel.findOneAndUpdate(
      { uuid },
      { croupier: croupierUuid },
      { new: true },
    ).exec()
    if (!game) return null

    return game
  }

  public gamesInTheClient = async (games: string[]): Promise<GameEntity[] | []> => {
    const allGames = await GameModel.find({ uuid: { $in: games } }).exec()
    return allGames
  }

  public gamesInTheOperator = async (games: string[]): Promise<GameEntity[] | []> => {
    const allGames = await GameModel.find({ uuid: { $in: games } }).exec()
    return allGames
  }

  public gamesAvailableOnTheClient = async (games: string[]): Promise<GameEntity[] | []> => {
    const allGames = await GameModel.find({ uuid: { $in: games }, active: true }).exec()
    return allGames
  }

  public changeGameLimits = async (
    uuid: string,
    limits: GameLimits,
  ): Promise<GameEntity | null> => {
    const game = await GameModel.findOneAndUpdate({ uuid }, limits, { new: true }).exec()
    if (!game) return null
    return game
  }
}
