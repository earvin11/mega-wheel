import { GameEntity } from './game.entity'

export interface UpdateGameEntity extends Pick<GameEntity, 'name' | 'providerId'> {}
