import PlayerModel from './player.model'
import { PlayerEntity, UpdatePlayerEntity } from '../domain/player.entity'
import { PlayerRepository } from '../domain/player.repository'

export class PlayerMongoRepository implements PlayerRepository {
  public createPlayer = async (player: PlayerEntity): Promise<PlayerEntity> => {
    const playerCreated = await PlayerModel.create(player)
    return playerCreated
  }

  public findByTokenWallet = async (token: string): Promise<PlayerEntity | null> => {
    const player = await PlayerModel.findOne({ tokenWallet: token })
    if (!player) return null
    return player
  }

  public findByUuid = async (uuid: string) => {
    const player = await PlayerModel.findOne({ uuid })
    if (!player) return null
    return player
  }

  public updatePlayer = async (
    uuid: string,
    dataToUpdate: UpdatePlayerEntity,
  ): Promise<PlayerEntity | null> => {
    const playerUpdated = await PlayerModel.findOneAndUpdate({ uuid }, dataToUpdate, {
      new: true,
    }).exec()

    if (!playerUpdated) return null
    return playerUpdated
  }
}
