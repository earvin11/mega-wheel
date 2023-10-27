import {QuestionRepository} from "App/questions/domain/question.repository";
import {QuestionEntity} from "App/questions/domain/question.entity";
import {Question} from "App/questions/domain/question.value";


export class QuestionUseCases {
  /**
   * Constructor
   * @param questionRepository
   */
  constructor(private readonly questionRepository:QuestionRepository) {}

  /**
   * Retrieve all Questions
   * @return questions
   */
  getAllQuestions = async ()=>{
    const questions = await this.questionRepository.getAllQuestions();
    return questions;

  }
  /**
   * Retrieve a Question by uuid
   * @param uuid
   * @return question
   */
  getOneQuestion = async (uuid:string)=>{
    const question = await this.questionRepository.getOneQuestion(uuid);
    return question;

  }
  /**
   * Retrieve a Question by User Id
   * @param userId
   * @return question
   */
  getOneQuestionByUser = async (userId:string)=>{
    const question = await this.questionRepository.getOneQuestionByUser(userId);
    return question;

  }
  /**
   * Create a Question
   * @param questionEntity
   * @return question
   */
  createQuestion = async (questionEntity:QuestionEntity)=>{
    const question:Question = new Question(questionEntity);
    const questionCreated = await this.questionRepository.createQuestion(question);
    return questionCreated;
  }
  /**
   * Update a Question
   * @param uuid
   * @param questionEntity
   * @return question
   *
   */
  updateQuestion = async (uuid:string,questionEntity:QuestionEntity)=>{
    const questionUpdated = await this.questionRepository.updateQuestion(uuid,questionEntity);
    return questionUpdated;

  }
  /**
   * Delete a Question by uuid
   * @param uuid
   * @return question
   *
   */
  deleteQuestion = async (uuid:string)=>{
    const questionDeleted = await this.questionRepository.deleteQuestion(uuid);
    return questionDeleted;
  }


}
