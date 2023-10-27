import Route from "@ioc:Adonis/Core/Route";
import questionController from "App/questions/infratructure/dependencies";



const questionRoutes = ()=>{

  Route.post('/', questionController.createQuestion).middleware(['validateToken','createQuestion'])
  Route.get('/',questionController.getAllQuestion).middleware(['validateToken'])
  Route.get('/:userId',questionController.getOneQuestionByUser).middleware(['validateToken'])
  Route.put('/:uuid', questionController.updateQuestion).middleware(['validateToken'])
  Route.delete('/:uuid', questionController.deleteQuestion).middleware(['validateToken'])
}

export default questionRoutes;
