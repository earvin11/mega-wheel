import Route from "@ioc:Adonis/Core/Route";
import croupierController from './dependencies';




const CroupierRoute = ()=>{

  Route.get('/', croupierController.getAllCroupiers).middleware(['validateToken'])
  Route.post('/', croupierController.createCroupier).middleware(['validateToken','createCroupier'])
  Route.put('/:uuid', croupierController.updateCroupier).middleware(['validateToken','createCroupier'])
  Route.delete('/:uuid', croupierController.deleteCroupier).middleware(['validateToken'])
}

export default CroupierRoute;
