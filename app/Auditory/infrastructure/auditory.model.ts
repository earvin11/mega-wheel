import { model, Schema } from 'mongoose'
import { AuditoryEntity } from '../domain/auditory.entity'

const AuditorySchema = new Schema<AuditoryEntity>(
  {
    action: String,
    ipAddress: String,
    resource: String,
    route: String,
    typeAction: String,
    user_uuid: String,
    uuid: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const AuditoryModel = model('auditory', AuditorySchema)

export default AuditoryModel
