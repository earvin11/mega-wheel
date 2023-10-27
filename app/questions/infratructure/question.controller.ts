import { HttpContext } from '@adonisjs/core/build/standalone'
import { CreateAuditoryParams } from 'App/Shared/Interfaces/create-auditory.interface'
import CreateAuditory from 'App/Shared/Helpers/create-auditory'

import console from 'console'
import { QuestionUseCases } from 'App/questions/application/QuestionUseCases'
import { QuestionEntity } from 'App/questions/domain/question.entity'
import { UserUseCase } from 'App/User/application/UserUseCase'

export class QuestionController {
  /**
   * Constructor
   * @param questionUseCases
   * @param userUseCase
   */
  constructor(private questionUseCases: QuestionUseCases, private userUseCase: UserUseCase) {}

  /**
   * Retrieve all Question
   * @param response
   * @return response
   */
  public getAllQuestion = async ({ response }: HttpContext) => {
    try {
      const questions = await this.questionUseCases.getAllQuestions()
      if (!questions || questions.length === 0)
        return response.status(404).json({ error: 'No registered questions' })

      return response.status(200).json({ message: 'Questions retrieves!', questions })
    } catch (error) {
      return response.status(400).json({ error: 'Could not get Question!' })
    }
  }
  /**
   * Retrieve a Question by User Id
   * @param  { request, response }
   * @return response
   */
  public getOneQuestionByUser = async ({ request, response }: HttpContext) => {
    try {
      const { userId } = request.params()
      const user = await this.userUseCase.getUserById(userId)
      if (!user) return response.status(400).json({ message: 'User not found!' })

      const question = await this.questionUseCases.getOneQuestionByUser(userId)

      if (!question) return response.status(400).json({ message: 'Question not found!' })

      return response.status(200).json({ message: 'Question retrieve!', q: question })
    } catch (error) {
      return response.status(400).json({ error: 'Fail to found Question!' })
    }
  }
  /**
   * Create a Question
   * @param context
   * @return response
   *
   */
  public createQuestion = async (context: HttpContext) => {
    const { request, response } = context
    try {
      const { question, userId } = request.body()
      const user = await this.userUseCase.getUserById(userId)
      if (!user) return response.status(400).json({ message: 'User not found!' })
      const newQuestion: QuestionEntity = { question, userId }
      const questionCreated = await this.questionUseCases.createQuestion(newQuestion)
      const auditoryParams: CreateAuditoryParams = {
        action: 'Create Question!',
        ctx: context,
        resource: newQuestion.question,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({ message: 'Question created!', question: questionCreated })
    } catch (error) {
      return response.status(400).json({ error: 'Fail to create Question!' })
    }
  }

  /**
   * Update Question
   * @param context
   * @return question
   */
  public updateQuestion = async (context: HttpContext) => {
    const { request, response } = context
    const { uuid } = request.params()
    const { question, userId } = request.body()
    if (!question && !userId)
    return response.status(401).json({ error: 'You must send at least the question!' })
    const questionDataToUpdate: QuestionEntity = {
      question,
      userId,
    }
    try {
      const questionExist = await this.questionUseCases.getOneQuestion(uuid)
      if (!questionExist) return response.status(400).json({ message: 'Question not found!' })
      const questionUpdated = await this.questionUseCases.updateQuestion(uuid, questionDataToUpdate)
      const auditoryParams: CreateAuditoryParams = {
        action: 'Update Question!',
        ctx: context,
        resource: questionUpdated?.uuid,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({ message: 'Question update!', question: questionUpdated })
    } catch (error) {
      console.log(error)
      return response.status(400).json({ error: 'Fail to update Question!' })
    }
  }
  /**
   * Delete Question
   * @param context
   * @return question
   */
  public deleteQuestion = async (context: HttpContext) => {
    const { request, response } = context
    try {
      const { uuid } = request.params()
      const questionExist = await this.questionUseCases.getOneQuestion(uuid)
      if (!questionExist) return response.status(400).json({ message: 'Question not found!' })
      const question = await this.questionUseCases.deleteQuestion(uuid)
      const auditoryParams: CreateAuditoryParams = {
        action: 'Delete Question!',
        ctx: context,
        resource: question?.uuid,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({ message: 'Question deleted!', question })
    } catch (error) {
      return response.status(400).json({ error: 'Fail to delete Question!' })
    }
  }
}
