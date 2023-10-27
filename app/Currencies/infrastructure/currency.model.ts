import { Schema, model } from 'mongoose'
import { CurrencyEntity } from '../domain/currency.entity'

const CurrencySchema = new Schema<CurrencyEntity>(
  {
    isoCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    usdRateChange: {
      type: Number,
      required: true,
    },
    exchangeRateHistory: {
      type: [],
    },
    uuid: {
      type: String,
      unique: true,
    },
    status: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const CurrencyModel = model('currency', CurrencySchema)

export default CurrencyModel
