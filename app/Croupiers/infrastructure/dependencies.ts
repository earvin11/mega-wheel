
import {CroupierMongoRepository} from "App/Croupiers/infrastructure/croupier.repository";
import {CroupierUseCases} from "App/Croupiers/application/CroupierUseCases";
import {CroupierController} from "App/Croupiers/infrastructure/croupier.controller";

const croupierRepository = new CroupierMongoRepository();
const croupierUseCases = new CroupierUseCases(croupierRepository);
const croupierController = new CroupierController(croupierUseCases);

export default croupierController;
