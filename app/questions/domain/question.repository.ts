import {FaqEntity} from "App/Faqs/domain/faq.entity";
import {QuestionEntity} from "App/questions/domain/question.entity";

export interface QuestionRepository {
  getAllQuestions():Promise<QuestionEntity[] | []>
  getOneQuestion(uuid:string):Promise<QuestionEntity | null>
  getOneQuestionByUser(userId:string):Promise<QuestionEntity | null>
  createQuestion(faq:FaqEntity):Promise<QuestionEntity>
  updateQuestion(uuid:string,data:FaqEntity):Promise<QuestionEntity | null>
  deleteQuestion(uuid:string):Promise<QuestionEntity | null>
}
