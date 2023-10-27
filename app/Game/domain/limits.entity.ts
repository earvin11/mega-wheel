import { GameEntity } from './game.entity'

export interface GameLimits extends Pick<GameEntity, 'minBet' | 'maxBet'> {}
