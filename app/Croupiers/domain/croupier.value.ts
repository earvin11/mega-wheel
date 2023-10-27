import { CroupierEntity } from './croupier.entity'
import { GenerateId } from '../../Shared/Helpers/generate-id.helpers'

export class Croupier implements CroupierEntity {
  public name: string;
  public uuid: string;
  public status: boolean;


  constructor(croupier: CroupierEntity) {
    const { uuid } = new GenerateId();
    this.uuid = uuid;
    this.name = croupier.name;
    this.status = true;

  }
}
