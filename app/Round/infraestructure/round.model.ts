import { Schema, model } from 'mongoose'
import { RoundEntity } from '../domain'

const RoundSchema = new Schema<RoundEntity>(
  {
    uuid: String,
    result: { type: Number, default: -1 },
    start_date: String,
    end_date: String,
    jackpot: {
      number: { type: Number },
      multiplier: { type: Number },
    },
    gameUuid: { type: String, required: true },
    providerId: { type: String, required: true },
    identifierNumber: String,
    open: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
)

const RoundModel = model('round', RoundSchema)
export default RoundModel
