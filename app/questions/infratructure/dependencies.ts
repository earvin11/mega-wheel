
import {QuestionMongoRepository} from "App/questions/infratructure/question.repository";
import {QuestionUseCases} from "App/questions/application/QuestionUseCases";
import {QuestionController} from "App/questions/infratructure/question.controller";
import {UserUseCase} from "App/User/application/UserUseCase";
import {MongoUserRepository} from "App/User/infrastructure/user.repository";

const questionRepository = new QuestionMongoRepository();
const questionUseCases = new  QuestionUseCases(questionRepository);
const userRepository = new MongoUserRepository();
const userUseCase = new UserUseCase(userRepository);
const questionController = new QuestionController(questionUseCases,userUseCase);

export default questionController;
