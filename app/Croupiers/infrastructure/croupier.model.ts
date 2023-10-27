import { model, Schema } from 'mongoose'
const  CroupierSchema = new Schema(
  {

    name: {
      type: String,
      default: "none",
    },
    uuid: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }


)

const CroupierModel = model('croupiers',CroupierSchema);
export default CroupierModel;
