import { Schema, model } from 'mongoose'
import { LogEntity } from '../domain/log.entity'

const LogSchema = new Schema<LogEntity>(
  {
    typeError: { type: String },
    request: { type: Object },
    response: { type: Object },
    error: { type: String },
    ip: { type: String },
    player: { type: String },
    uuid: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const LogModel = model('logs', LogSchema)

export default LogModel
