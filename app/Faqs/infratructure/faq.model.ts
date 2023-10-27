import {model, Schema} from "mongoose";

const  faqSchema = new Schema(
  {

    answer: {
      type: String,
      default: "none",
    },
    uuid: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      default: "none",
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

const FaqModel = model('faqs',faqSchema);
export default FaqModel;
