export interface BetEntity {
    bet: BetBody[];
    uuid?: string;
    gameUuid: string;
    playerUuid: string;
    roundUuid: string;
    isPaid: boolean;
};

export interface BetBody {
    number: number;
    amount: number;
}