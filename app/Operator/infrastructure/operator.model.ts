import { model, Schema } from 'mongoose'

const OperatorSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    client: {
      type: String,
      ref: 'Client',
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    minBet: {
      type: Number,
      required: true,
    },
    maxBet: {
      type: Number,
      required: true,
    },
    endpointAuth: {
      type: String,
      required: true,
    },
    endpointBet: {
      type: String,
      required: true,
    },
    endpointWin: {
      type: String,
      required: true,
    },
    endpointRollback: {
      type: String,
      required: true,
    },
    casinoToken: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    operatorId: {
      type: Number,
      required: true,
    },
    chips: [],
    games: [String],
    currencies: [String],
    operatorGamesLimits: [Object],
    gamesPayments: [
      {
        game: {
          type: String
        },
        chanceSimple: {
          type: Number,
          default: 2,
        },
        tie: {
          type: Number,
          default: 12,
        },
        perfectTie: {
          type: Number,
          default: 75,
        },
        goldenK: {
          type: Number,
          default: 4,
        },
        jackpot: {
          type: Number,
          default: 75,
        },
        color: {
          type: Number,
          default: 2,
        },
        size: {
          type: Number,
          default: 2,
        },
        parity: {
          type: Number,
          default: 2,
        },
      }
    ],
    limits: [
      {
        game: String,
        currency: String,
        minBet: Number,
        maxBet: Number,
        maxBetPosition: Number,
        chanceSimple: {
          minBet: Number,
          maxBet: Number
        },
        tie: {
          minBet: Number,
          maxBet: Number
        },
        perfectTie: {
          minBet: Number,
          maxBet: Number
        },
        jackpot: {
          minBet: Number,
          maxBet: Number
        },
        size: {
          minBet: Number,
          maxBet: Number
        },
        parity: {
          minBet: Number,
          maxBet: Number
        },
        color: {
          minBet: Number,
          maxBet: Number
        },
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const OperatorModel = model('operators', OperatorSchema)
export default OperatorModel
