
import {FaqMongoRepository} from "App/Faqs/infratructure/faq.repository";
import {FaqUseCases} from "App/Faqs/application/FaqUseCases";
import {FaqController} from "App/Faqs/infratructure/faq.controller";

const faqRepository = new FaqMongoRepository();
const faqUseCases = new  FaqUseCases(faqRepository);
const faqController = new FaqController(faqUseCases);

export default faqController;
