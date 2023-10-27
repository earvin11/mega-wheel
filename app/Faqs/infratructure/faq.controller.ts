import {FaqUseCases} from "App/Faqs/application/FaqUseCases";
import {HttpContext} from "@adonisjs/core/build/standalone";
import {FaqEntity} from "App/Faqs/domain/faq.entity";
import {CreateAuditoryParams} from "App/Shared/Interfaces/create-auditory.interface";
import CreateAuditory from "App/Shared/Helpers/create-auditory";

import console from "console";
import {UpdateFaqEntity} from "App/Faqs/domain/updateFaq.entity";

export class FaqController {
  /**
   * Constructor
   * @param faqUseCase
   */
  constructor(private faqUseCase: FaqUseCases) {
  }

  /**
   * Retrieve all Faqs
   * @param HttpContext
   * @return response
   */
  public getAllfaqs = async ({response}: HttpContext) => {

    try {
      const faqs = await this.faqUseCase.getAllFaqs();
      if (!faqs || faqs.length === 0)
        return response.status(404).json({error: 'No registered croupiers'})
      return response.status(200).json({message: 'FAQS retrieves!', faqs})
    } catch (error) {
      return response.status(400).json({error: 'Could not get FAQS!'})
    }
  }
  /**
   * Get a FAQ by uuid
   * @param HttpContext
   * @return response
   */
  public getOneFaq = async (context: HttpContext) => {
    const {request, response} = context;
    try {
      const {uuid} = request.params();
      const faq = await this.faqUseCase.getOneFaq(uuid);
      if (!faq) return response.status(400).json({message: 'FAQ not found!'})
      return response.status(200).json({message: 'FAQ retrieve!', faq})
    } catch (error) {
      return response.status(400).json({error: 'Fail to found FAQ!'})
    }
  }
  /**
   * Create a Faq
   * @param context
   * @return response
   */
  public createFaq = async (context: HttpContext) => {
    const {request, response} = context;
    try {
      const {question, answer} = request.body();
      const faq: FaqEntity = {question, answer};
      const newFaq = await this.faqUseCase.createFaq(faq);
      const auditoryParams: CreateAuditoryParams = {
        action: 'Create Faq!',
        ctx: context,
        resource: newFaq.question,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({message: 'FAQ created!', newFaq});
    } catch (error) {
      return response.status(400).json({error: 'Fail to create FAQ!'})
    }
  }
  /**
   * Update FAQ
   * @param context
   * @return response
   */
  public updateFaq = async (context: HttpContext) => {
    const {request, response} = context;

    try {
      const {uuid} = request.params();
      const faq = await this.faqUseCase.getOneFaq(uuid);
      if (!faq) return response.status(400).json({message: 'FAQ not found!'})
      const {question, answer} = request.body();
      if (!question && !answer)
        return response.status(401).json({ error: 'You must send at least the answer!' })
      const faqUpdate: UpdateFaqEntity = {
        answer,
        question
      };
      const faqUpdated = await this.faqUseCase.updateFaq(uuid, faqUpdate);
      const auditoryParams: CreateAuditoryParams = {
        action: 'Update faq!',
        ctx: context,
        resource: faqUpdated?.uuid,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({message: 'FAQ update!', faqUpdated})
    } catch (error) {
      console.log(error);
      return response.status(400).json({error: 'Fail to update FAQ!'})
    }
  }
  /**
   * Delete FAQ
   * @param context
   * @return response
   */
  public deleteFaq = async (context: HttpContext) => {
    const {request, response} = context;
    try {
      const {uuid} = request.params();
      const faq = await this.faqUseCase.getOneFaq(uuid);
      if (!faq) return response.status(400).json({message: 'FAQ not found!'})
      const faqDelete = await this.faqUseCase.deleteFaq(uuid);
      const auditoryParams: CreateAuditoryParams = {
        action: 'Delete FAQ!',
        ctx: context,
        resource: faqDelete?.uuid,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({message: 'FAQ deleted!', faqDelete})
    } catch (error) {
      return response.status(400).json({error: 'Fail to delete FAQ!'})
    }
  }


}
