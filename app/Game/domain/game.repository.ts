import { GameEntity } from './game.entity'
import { GameLimits } from './limits.entity'
import { UpdateGameEntity } from './updateGame.entity'

export interface GameRepository {
  createGame(game: GameEntity): Promise<GameEntity>
  getGameByUuid(uuid: string): Promise<GameEntity | null>
  getAllGames(): Promise<GameEntity[] | []>
  updateGame(uuid: string, dataToUpdate: UpdateGameEntity): Promise<GameEntity | null>
  deleteGame(uuid: string): Promise<GameEntity | null>
  addOperatorToGame(uuid: string, operatorUuid: string): Promise<GameEntity | null>
  getGameByOperator(operatorUuid: string): Promise<GameEntity | null>
  updateOperatorInGame(uuid: string, operatorUuid: string): Promise<GameEntity | null>
  addCroupierToGame(uuid: string, croupierUuid: string): Promise<GameEntity | null>
  gamesInTheClient(games: string[]): Promise<GameEntity[] | []>
  gamesAvailableOnTheClient(games: string[]): Promise<GameEntity[] | []>
  changeGameLimits(uuid: string, limits: GameLimits): Promise<GameEntity | null>

  // DRAGON TIGERS OPERATOR
  gamesInTheOperator(games: string[]): Promise<GameEntity[] | []>
}
