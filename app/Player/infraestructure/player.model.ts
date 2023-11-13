import { Schema, model } from 'mongoose'
import { PlayerEntity } from '../domain/player.entity'

const PlayerSchema = new Schema<PlayerEntity>(
  {
    userId: {
      type: String,
    },
    username: {
      type: String,
    },
    uuid: {
      type: String,
    },
    operator: {
      type: Object,
    },
    currencyUuid: {
      type: String,
    },
    lastBalance: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      defualt: false,
    },
    tokenWallet: {
      type: String,
    },
    WL: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)
const PlayerModel = model('Player', PlayerSchema)
export default PlayerModel
