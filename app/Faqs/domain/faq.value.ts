import {FaqEntity} from "App/Faqs/domain/faq.entity";
import {GenerateId} from "App/Shared/Helpers/generate-id.helpers";


export class Faq implements FaqEntity {
  public answer?:string;
  public question:string;
  public uuid:string;
  public status:boolean;
  constructor(faq:FaqEntity) {
    const { uuid } = new GenerateId();
    this.uuid = uuid;
    this.question= faq.question
    this.status = true;
    if(faq.answer)this.answer = faq.answer;
  }
}
