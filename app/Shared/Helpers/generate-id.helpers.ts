import { v4 as uuid } from 'uuid'

export class GenerateId {
  public uuid: string

  constructor() {
    this.uuid = uuid()
  }
}
