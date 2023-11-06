import { Schema, model } from 'mongoose'
import { BetEntity } from '../domain'

const BetSchema = new Schema<BetEntity>(
  {
    uuid: String,
    bet: [
      {
        number: Number,
        amount: Number,
      },
    ],
    playerUuid: String,
    roundUuid: String,
    totalAmount: Number,
    currencyUuid: String,
    isPaid: Boolean,
    gameUuid: String,
  },
  { timestamps: true, versionKey: false },
)

const BetModel = model('bet', BetSchema)
export default BetModel
