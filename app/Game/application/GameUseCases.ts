import { GameRepository } from '../domain/game.repository'
import { GameEntity } from '../domain/game.entity'
import { Game } from '../domain/game.value'
import { UpdateGameEntity } from '../domain/updateGame.entity'
import { GameLimits } from '../domain/limits.entity'

export class GameUseCases {
  constructor(private readonly gameRepository: GameRepository) {}

  public createGame = async (game: GameEntity) => {
    const newGame = new Game(game)
    const gameCreated = this.gameRepository.createGame(newGame)
    return gameCreated
  }

  public getGameByUuid = async (uuid: string) => {
    const game = await this.gameRepository.getGameByUuid(uuid)
    return game
  }

  public getAllGames = async () => {
    const games = await this.gameRepository.getAllGames()
    return games
  }

  public updateGame = async (uuid: string, dataToUpdate: UpdateGameEntity) => {
    const game = await this.gameRepository.updateGame(uuid, dataToUpdate)
    return game
  }

  public deleteGame = async (uuid: string) => {
    const game = await this.gameRepository.deleteGame(uuid)
    return game
  }

  public addOperatorToGame = async (uuid: string, operatorUuid: string) => {
    const game = await this.gameRepository.addOperatorToGame(uuid, operatorUuid)
    return game
  }

  public getGameByOperator = async (operatorUuid: string) => {
    const game = await this.gameRepository.getGameByOperator(operatorUuid)
    return game
  }

  public updateOperatorInGame = async (uuid: string, operatorUuid: string) => {
    const game = await this.gameRepository.updateOperatorInGame(uuid, operatorUuid)
    return game
  }

  public addCroupierToGame = async (uuid: string, croupierUuid: string) => {
    const game = await this.gameRepository.addCroupierToGame(uuid, croupierUuid)
    return game
  }

  public gamesInTheClient = async (games: string[]) => {
    const allGames = await this.gameRepository.gamesInTheClient(games)
    return allGames
  }

  public gamesAvailableOnTheClient = async (games: string[]) => {
    const allGames = await this.gameRepository.gamesAvailableOnTheClient(games)
    return allGames
  }

  public changeGameLimits = async (uuid: string, limits: GameLimits) => {
    const game = await this.gameRepository.changeGameLimits(uuid, limits)
    return game
  }

  // OPERATOR DRAGON TIGERS

  public gamesInTheOperator = async (gamesIds: string[]) => {
    const games = await this.gameRepository.gamesInTheOperator(gamesIds);
    return games
  }

}
