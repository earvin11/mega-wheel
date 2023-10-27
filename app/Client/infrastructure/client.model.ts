import { Schema, model } from 'mongoose'
import { ClientEntity } from '../domain/client.entity'

const ClientSchema = new Schema<ClientEntity>(
  {
    available: Boolean,
    currencies: [String],
    endpointAuth: String,
    endpointBet: String,
    endpointRollback: String,
    endpointWin: String,
    games: [String],
    loaderLogo: String,
    logo: String,
    name: {
      type: String,
      unique: true,
      required: true,
    },
    status: Boolean,
    useLogo: Boolean,
    uuid: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const ClientModel = model('client', ClientSchema)

export default ClientModel
