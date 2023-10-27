import { CroupierEntity } from './croupier.entity'

export interface CroupierRepository {

  getAllCroupiers(): Promise<CroupierEntity[] | []>
  getCroupier(uuid: string):Promise<CroupierEntity | null>
  createCroupier(croupier: CroupierEntity): Promise<CroupierEntity>
  updateCroupier(uuid: string, dataToUpdate: CroupierEntity): Promise<CroupierEntity | null>
  deleteCroupier(uuid:string):Promise<CroupierEntity | null>

}
