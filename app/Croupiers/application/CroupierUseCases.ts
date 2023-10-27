import {CroupierRepository} from '../domain/croupier.repository'
import {CroupierEntity} from "App/Croupiers/domain/croupier.entity";
import {Croupier} from "App/Croupiers/domain/croupier.value";


export class CroupierUseCases {
  constructor(private readonly repository: CroupierRepository) {
  }


  /**
   *  Retrive all croupier
   *  @return croupiers
   */
  public getAllCroupiers = async () => {
    const croupiers = await this.repository.getAllCroupiers();
    return croupiers

  }
  /**
   * Get a Croupier
   * @param uuid
   * @return croupier
   */
  public getCroupier = async (uuid: string) => {
    const croupier = await this.repository.getCroupier(uuid);
    return croupier;
  }
  /**
   *Create a croupier
   * @param croupier:CroupierEntity
   */
  public createCroupier = async (croupier: CroupierEntity) => {
    const newCroupier: Croupier = new Croupier(croupier);
    const croupierCreated = await this.repository.createCroupier(newCroupier);
    return croupierCreated;

  }
  /**
   * Update a croupier
   * @param uuid
   * @param data
   * @return croupier updated
   */
  public updateCroupier = async (uuid: string, data: CroupierEntity) => {
    const croupierUpdated = await this.repository.updateCroupier(uuid, data);
    return croupierUpdated;
  }

  /**
   * Delete a croupier by uuid
   * @param uuid
   * @return croupier deleted
   */
  public deleteCroupier = async (uuid: string) => {
    const croupierDeleted = await this.repository.deleteCroupier(uuid);
    return croupierDeleted
  }

}
