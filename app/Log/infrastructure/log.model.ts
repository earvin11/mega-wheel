import { Schema, model } from 'mongoose'
import { LogEntity } from '../domain/log.entity'

const LogSchema = new Schema<LogEntity>(
  {
    request: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    player: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const LogModel = model('logs', LogSchema)

export default LogModel
