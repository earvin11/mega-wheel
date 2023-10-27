import { Schema, model } from 'mongoose'
import { Status } from 'App/Shared/Helpers/status'
import { UserEntity } from '../domain/user.entity'

const UserRegisterSchema = new Schema<UserEntity>(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
    },
    currencies: [
      {
        type: String,
        ref: 'Currency',
      },
    ],
    operator: {
      type: String,
      ref: 'Operator',
    },
    status: {
      type: Boolean,
      default: Status.ENABLE,
    },
    client: {
      type: String,
      ref: 'Client',
      required: true,
    },
    userClient: {
      type: Boolean,
      default: false,
    },
    tokenWallet: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const UserModel = model('users', UserRegisterSchema)

export default UserModel
