import { Schema, model } from 'mongoose'
import { ChipEntity } from 'App/Chip/domain/chip.entity'

const ChipSchema = new Schema<ChipEntity>(
  {
    value: {
      type: Number,
      required: true,
    },
    color: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: Boolean,
    uuid: String,
    operator: String
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const ChipModel = model('chips', ChipSchema)

export default ChipModel
