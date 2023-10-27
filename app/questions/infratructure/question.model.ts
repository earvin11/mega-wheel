import {model, Schema} from "mongoose";

const  questionSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      default: "none",
    },
    userId:{
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

const QuestionModel = model('questions',questionSchema);
export default QuestionModel;
