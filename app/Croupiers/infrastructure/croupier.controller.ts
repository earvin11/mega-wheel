import {CroupierUseCases} from "App/Croupiers/application/CroupierUseCases";
import {HttpContext} from "@adonisjs/core/build/standalone";
import {CroupierEntity} from "App/Croupiers/domain/croupier.entity";
import {CreateAuditoryParams} from "App/Shared/Interfaces/create-auditory.interface";
import CreateAuditory from "App/Shared/Helpers/create-auditory";
import * as console from "console";


export class CroupierController {

  /**
   * Constructor
   * @param useCases dependency injection
   */
  constructor(private useCases: CroupierUseCases) {
  }

  /**
   * Retrive all croupiers
   * @param response HttpContext
   * @return response Json
   */
  public getAllCroupiers = async ({response}: HttpContext) => {
    try {
      const croupiers = await this.useCases.getAllCroupiers();
      if (croupiers.length === 0)
        return response.status(404).json({error: 'No registered croupiers'})

      return response.status(200).json({message: 'Croupiers retrives!', croupiers})
    } catch (error) {
      return response.status(400).json({error: 'Could not get croupiers!'})
    }
  }
  /**
   * Controller to create croupier
   * @param context HttpContext
   * @return response Json
   */
  public createCroupier = async (context: HttpContext) => {
    const {request, response} = context;
    try {

      const {
        name

      } = request.body()

      const croupier: CroupierEntity = {name};

      const croupierCreated = await this.useCases.createCroupier(croupier);

      const auditoryParams: CreateAuditoryParams = {
        action: 'Create croupier!',
        ctx: context,
        resource: croupierCreated.name,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({message: 'Croupier created!', croupierCreated})
    } catch (error) {
      console.log(error);
      return response.status(400).json({error: 'Fail to create croupier!'})
    }
  }
  /**
   * Controller to update croupier
   * @param context HttpContext
   * @return response Json
   *
   */
  public updateCroupier = async (context: HttpContext) => {
    const {request, response} = context;
    try {

      const {
        name


      } = request.body()
      const {uuid} = request.params();
      const croupier = await this.useCases.getCroupier(uuid);

      if (!croupier) return response.status(400).json({message: 'Croupier not found!'})
      const croupierUpdate: CroupierEntity = {name};

      const croupierUpdated = await this.useCases.updateCroupier(uuid, croupierUpdate);

      const auditoryParams: CreateAuditoryParams = {
        action: 'Update croupier!',
        ctx: context,
        resource: croupierUpdated?.name,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({message: 'Croupier update!', croupierUpdated})
    } catch (error) {
      console.log(error);
      return response.status(400).json({error: 'Fail to update croupier!'})
    }
  }
  /**
   * Controller delete a croupier
   * @param context HttpContext
   * @return response Json
   */
  public deleteCroupier = async (context: HttpContext) => {
    const {request, response} = context;
    try {

      const {uuid} = request.params();
      const croupier = await this.useCases.getCroupier(uuid);

      if (!croupier) return response.status(400).json({message: 'Croupier not found!'})

      const croupierDeleted = await this.useCases.deleteCroupier(uuid);

      const auditoryParams: CreateAuditoryParams = {
        action: 'Delete croupier!',
        ctx: context,
        resource: croupierDeleted?.name,
      }
      await CreateAuditory(auditoryParams)
      return response.status(200).json({message: 'Croupier deleted!', croupierDeleted})
    } catch (error) {

      return response.status(400).json({error: 'Fail to delete croupier!'})
    }
  }

}
