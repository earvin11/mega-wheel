import {CroupierRepository} from "App/Croupiers/domain/croupier.repository";
import CroupierModel from "App/Croupiers/infrastructure/croupier.model";
import {CroupierEntity} from "App/Croupiers/domain/croupier.entity";

export class CroupierMongoRepository implements CroupierRepository{

  /**
   * Retrive all croupier from model
   * @return croupiers
   */
  public async getAllCroupiers(): Promise<CroupierEntity[] | []> {
    const croupiers = await CroupierModel.find().exec();
    return croupiers;

  }

  /**
   * Retrieve a croupier by uuid from the model
   * @param uuid
   * @return croupier
   */
  public async getCroupier(uuid:string):Promise<CroupierEntity | null>{
    const croupier = await CroupierModel.findOne({uuid});
    return croupier;
  }

  /**
   * Create a croupier from the model
   * @param croupier
   * @return croupier
   */

  public async createCroupier(croupier:CroupierEntity):Promise<CroupierEntity>{
    const croupierCreated = await CroupierModel.create(croupier);
   return croupierCreated;


  }

  /**
   * Update name in croupier from the model
   * @param uuid
   * @param data
   * @return croupier
   */
  public async updateCroupier(uuid:string,data:CroupierEntity ):Promise<CroupierEntity | null>{
    const croupierUpdated = await CroupierModel.findOneAndUpdate({uuid},data,{new:true});
    return croupierUpdated;


  }

  /**
   * Symbolic delete a croupier by uuid from the model
   * @param uuid
   * @return croupier
   */
  public async deleteCroupier(uuid:string):Promise<CroupierEntity | null>{
    const croupierDeleted = await CroupierModel.findOneAndUpdate({uuid},{status:false},{new:true});
    return croupierDeleted;
  }
}
