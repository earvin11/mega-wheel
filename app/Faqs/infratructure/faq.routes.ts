import Route from "@ioc:Adonis/Core/Route";
import faqController from "App/Faqs/infratructure/dependencies";



const faqRoutes = ()=>{

  Route.post('/', faqController.createFaq).middleware(['validateToken','createFaq'])
  Route.get('/',faqController.getAllfaqs).middleware(['validateToken'])
  Route.get('/:uuid',faqController.getOneFaq).middleware(['validateToken'])
  Route.put('/:uuid', faqController.updateFaq).middleware(['validateToken'])
  Route.delete('/:uuid', faqController.deleteFaq).middleware(['validateToken'])
}

export default faqRoutes;
