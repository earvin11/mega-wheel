import { Schema, model } from 'mongoose'
import { SupportEntity } from '../domain/support.entity'

const SupportSchema = new Schema<SupportEntity>(
  {
    description: {
      type: String,
      required: true,
    },
    playerEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      unique: true,
    },
    operator: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const SupportModel = model('support', SupportSchema)

export default SupportModel
