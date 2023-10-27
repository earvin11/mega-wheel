import {FaqEntity} from "App/Faqs/domain/faq.entity";

export interface UpdateFaqEntity extends Pick<FaqEntity, 'question' | 'answer'>{}
