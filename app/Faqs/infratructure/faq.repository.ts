import {FaqRepository} from "App/Faqs/domain/faq.repository";
import {FaqEntity} from "App/Faqs/domain/faq.entity";
import FaqModel from "App/Faqs/infratructure/faq.model";


export class FaqMongoRepository implements FaqRepository {

  /**
   * Retrieve all faqs from the model
   * @return faqs
   */
   public async getAllFaqs(): Promise<FaqEntity[] | []> {
     const faqs = await FaqModel.find().exec();
     return faqs;
   }

  /**
   * Retrieve a faq by uuid from the model
   * @param uuid
   * @return faq
   */
   public async getOneFaq(uuid:string):Promise<FaqEntity | null>{
      const faq = await FaqModel.findOne({uuid}).exec();
      return faq;
   }

  /**
   * Create a faq from the model
   * @param faq
   * @return faq
   */
   public async  createFaqs(faq: FaqEntity): Promise<FaqEntity>  {
     const faqCreated = await FaqModel.create(faq);
      return faqCreated;

   }

  /**
   * Update a faq from the model
   * @param uuid
   * @param data
   * @return faq
   */
   public async updateFaq(uuid:string,data:FaqEntity):Promise<FaqEntity | null>{
     const faqUpdated = await FaqModel.findOneAndUpdate({uuid},data,{new:true}).exec();
     if (!faqUpdated) return null;
    return faqUpdated;

  }

  /**
   * Delete a faq from the model
   * @param uuid
   * @return faq
   */
  public async deleteFaq(uuid:string):Promise<FaqEntity | null>{
     const faqDeleted = await FaqModel.findOneAndUpdate({uuid},{status:false},{new:true}).exec();
     if(!faqDeleted) return null;
     return faqDeleted;
   }

}
