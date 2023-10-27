import { Schema, model } from 'mongoose'
import { ExchangeEntity } from '../domain/exchange.entity'

const ExchangeSchema = new Schema<ExchangeEntity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    uuid: {
      type: String,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const ExchangeModel = model('exchange', ExchangeSchema)

export default ExchangeModel
