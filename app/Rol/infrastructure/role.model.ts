import { Schema, model } from 'mongoose'
import { RoleEntity } from '../domain/role.entity'

const RoleSchema = new Schema<RoleEntity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    uuid: String,
    status: Boolean,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const RoleModel = model('roles', RoleSchema)

export default RoleModel
