import { PlayerEntity, UpdatePlayerEntity } from './player.entity'

export interface PlayerRepository {
  createPlayer(player: PlayerEntity): Promise<PlayerEntity>
  findByTokenWallet(token: string): Promise<PlayerEntity | null>
  findByUuid(uuid: string): Promise<PlayerEntity | null>
  updatePlayer(uuid: string, dataToUpdate: UpdatePlayerEntity): Promise<PlayerEntity | null>
}
