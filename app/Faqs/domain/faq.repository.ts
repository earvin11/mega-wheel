import {FaqEntity} from "App/Faqs/domain/faq.entity";

export interface FaqRepository{
  getAllFaqs():Promise<FaqEntity[] | []>
  getOneFaq(uuid:string):Promise<FaqEntity | null>
  createFaqs(faq:FaqEntity):Promise<FaqEntity>
  updateFaq(uuid:string,data:FaqEntity):Promise<FaqEntity | null>
  deleteFaq(uuid:string):Promise<FaqEntity | null>
}
