import { Schema, model } from 'mongoose'
import { GameEntity } from '../domain/game.entity'

const GameSchema = new Schema<GameEntity>(
  {
    active: {
      type: Boolean,
      default: true,
    },
    croupier: {
      type: String,
    },
    manualDisable: {
      type: Boolean,
      default: false,
    },
    maxBet: {
      type: Number,
      required: true,
    },
    minBet: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    operator: {
      type: String,
    },
    providerId: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    uuid: {
      type: String,
    },

    // !Note: Add game logic properties here.
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const GameModel = model('gameOld', GameSchema)

export default GameModel
