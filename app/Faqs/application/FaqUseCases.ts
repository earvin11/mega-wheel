import {FaqRepository} from "App/Faqs/domain/faq.repository";
import {FaqEntity} from "App/Faqs/domain/faq.entity";
import {Faq} from "App/Faqs/domain/faq.value";


export class FaqUseCases {
  /**
   * Constructor
   * @param faqRepository
   */
  constructor(private readonly faqRepository:FaqRepository) {}

  /**
   * Retrieve all Faqs
   * @return faqs
   */
  getAllFaqs = async ()=>{
    const faqs = await this.faqRepository.getAllFaqs();
    return faqs;

  }
  /**
   * Retrieve a FAQ by uuid
   * @param uuid
   * @return faq
   */
  getOneFaq = async (uuid:string)=>{
    const faq = await this.faqRepository.getOneFaq(uuid);
    return faq;

  }
  /**
   * Create a faq
   * @param faq
   * @return faq
   */
  createFaq = async (faq:FaqEntity)=>{
    const newFaq:Faq = new Faq(faq);
    const faqCreated = await this.faqRepository.createFaqs(newFaq);
    return faqCreated;
  }
  /**
   * Update a faq by uuid
   * @param uuid
   * @param data
   * @return faq
   */
  updateFaq = async (uuid:string,data:FaqEntity)=>{
    const updateFaq = await this.faqRepository.updateFaq(uuid,data);
    return updateFaq;

  }
  /**
   * Symbolic delete a FAQ
   * @param uuid
   * @return faq
   */
  deleteFaq = async (uuid:string)=>{
    const deletedFaq = await this.faqRepository.deleteFaq(uuid);
    return deletedFaq;
  }


}
