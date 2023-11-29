import { model, Schema } from 'mongoose'
import { RoundBetEntity } from '../domain/roundBet.entity'

const roundBetsSchema = new Schema<RoundBetEntity>(
  {
    roundUuid: {
      type: String,
    },
    numbers: [
      {
        number: {
          type: Number,
        },
        amount: {
          type: Number,
        },
      },
    ],
    uuid: {
      type: String,
    },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const RoundBetModel = model('RoundBets', roundBetsSchema)
export default RoundBetModel
