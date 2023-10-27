import {GenerateId} from "App/Shared/Helpers/generate-id.helpers";
import {QuestionEntity} from "App/questions/domain/question.entity";


export class Question implements QuestionEntity {
  public question:string;
  public uuid:string;
  public userId:string;
  public status:boolean;
  constructor(questionEntity:QuestionEntity) {
    const { uuid } = new GenerateId();
    this.uuid = uuid;
    this.question= questionEntity.question
    this.status = true;
    this.userId = questionEntity.userId;
  }
}
