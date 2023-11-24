import { GenerateId } from "../../Shared/Helpers/generate-id.helpers";
import { WheelFortuneEntity } from "./wheel-fortune.entity";

export class WheelForune implements WheelFortuneEntity {
  public name: string
  public providerId: string
  public uuid?: string | undefined
  public active?: boolean | undefined
  public status?: boolean | undefined
  public manualDisable?: boolean | undefined
  public croupier?: string | undefined
  public betTime: number
  public jackpot: boolean
  public imgBackgrout: string
  public urlTransmision: string
  public colorBackground: string
  public logo: string
  public language: string
  public type: string
  public launchUrl: string
  public percentReturnToPlayer: number

  constructor(wheelFortune: WheelFortuneEntity) {
    const { uuid } = new GenerateId()
    this.name = wheelFortune.name
    this.providerId = wheelFortune.providerId
    this.uuid = uuid
    this.active = true
    this.status = true
    this.manualDisable = false
    this.croupier = wheelFortune.croupier
    this.betTime = wheelFortune.betTime
    this.jackpot = wheelFortune.jackpot
    this.imgBackgrout = wheelFortune.imgBackgrout
    this.urlTransmision = wheelFortune.urlTransmision
    this.colorBackground = wheelFortune.colorBackground
    this.logo = wheelFortune.logo
    this.language = wheelFortune.language
    this.type = 'WHEEL'
    this.launchUrl = wheelFortune.launchUrl
    this.percentReturnToPlayer = wheelFortune.percentReturnToPlayer
  }
}
