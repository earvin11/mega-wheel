import { Schema, model } from 'mongoose'
import { TransactionEntity } from '../domain/transactions.entity'

const TransactionSchema = new Schema<TransactionEntity>(
  {
    amount: {
      type: Number,
      required: true,
    },
    amountExchangeDollar: {
      type: Number,
      required: true,
    },
    bet: {
      type: Object,
      required: true,
    },
    currency: {
      type: Object,
      required: true,
    },
    currencyExchangeDollar: {
      type: Number,
      required: true,
    },
    game: {
      type: Object,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    player: {
      type: Object,
      required: true,
    },
    playerCountry: {
      type: String,
      required: true,
    },
    playerIp: {
      type: String,
      required: true,
    },
    round: {
      type: Object,
      required: true,
    },
    typeTransaction: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    userBalance: {
      type: Number,
      required: true,
    },
    usersOnline: {
      type: Number,
      default: 0,
    },
    uuid: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
)

const TransactionModel = model('transaction', TransactionSchema)
export default TransactionModel
