import { QuestionRepository } from 'App/questions/domain/question.repository'
import QuestionModel from 'App/questions/infratructure/question.model'
import { QuestionEntity } from 'App/questions/domain/question.entity'

export class QuestionMongoRepository implements QuestionRepository {
  /**
REfactori   * Retrieve all questions from the model
   * @return questions
   */
  public async getAllQuestions(): Promise<QuestionEntity[] | []> {
    const questions = await QuestionModel.find().exec()
    return questions
  }

  /**
   * Retrieve a question by user Id from the model
   * @param userId
   * @return question
   */
  public async getOneQuestionByUser(userId: string): Promise<QuestionEntity | null> {
    const question = await QuestionModel.findOne({ userId }).exec()
    return question
  }

  /**
   * Retrieve question by uuid from the model
   * @param uuid
   * @return question
   */
  public async getOneQuestion(uuid: string): Promise<QuestionEntity | null> {
    const question = await QuestionModel.findOne({ uuid }).exec()
    return question
  }

  /**
   * Create a Question from the model
   * @param question
   *
   */
  public async createQuestion(question: QuestionEntity): Promise<QuestionEntity> {
    const questionCreated =  await QuestionModel.create(question);
    return questionCreated;
  }

  /**
   * Update a question from the model
   * @param uuid
   * @param data
   * @return question
   */
  public async updateQuestion(uuid: string, data: QuestionEntity): Promise<QuestionEntity | null> {
    const question = await QuestionModel.findOneAndUpdate({ uuid }, data, { new: true }).exec()
    if (!question) return null
    return question
  }

  /**
   * Delete a question by uuid from the model
   * @param uuid
   * @return question
   */
  public async deleteQuestion(uuid: string): Promise<QuestionEntity | null> {
    const question = await QuestionModel.findOneAndUpdate(
      { uuid },
      { status: false },
      { new: true }
    ).exec()
    if (!question) return null
    return question
  }
}
