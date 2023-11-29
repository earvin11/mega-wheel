import { GenerateId } from '../../Shared/Helpers/generate-id.helpers';
import { BetBody, BetEntity } from './bet.entity';

export class Bet implements BetEntity {
    public bet: BetBody[];
    public uuid?: string;
    public gameUuid: string;
    public playerUuid: string;
    public roundUuid: string;
    public isPaid: boolean;
    public totalAmount: number;
    public currencyUuid: string;
    public currencyIsoCode: string;

    constructor(bet: BetEntity) {
        this.bet = bet.bet;
        this.uuid = new GenerateId().uuid;
        this.gameUuid = bet.gameUuid;
        this.playerUuid = bet.playerUuid;
        this.roundUuid = bet.roundUuid;
        this.isPaid = false;
        this.totalAmount = bet.totalAmount;
        this.currencyUuid =  bet.currencyUuid;
        this.currencyIsoCode = bet.currencyIsoCode;
    };
};