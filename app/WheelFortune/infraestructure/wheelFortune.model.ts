import { Schema, model } from 'mongoose'
import { WheelFortuneEntity } from '../domain/wheel-fortune.entity'

const WheelSchema = new Schema<WheelFortuneEntity>(
  {
    name: String,
    active: { type: Boolean, default: true },
    betTime: { type: Number, default: 10 },
    colorBackground: String,
    croupier: String,
    imgBackgrout: String,
    jackpot: { type: Boolean, default: false },
    language: String,
    logo: String,
    manualDisable: { type: Boolean, default: false },
    providerId: String,
    status: { type: Boolean, default: true },
    urlTransmision: String,
    uuid: String,
    type: {
      type: String,
      default: 'WHEEL',
    },
    percentReturnToPlayer: { type: Number, default: 95 },
  },
  { versionKey: false, timestamps: true },
)

const GameModel = model('game', WheelSchema)
export default GameModel
