import { PlayerEntity, UpdatePlayerEntity } from '../domain/player.entity';
import { PlayerRepository } from '../domain/player.repository';
import { Player } from '../domain/player.value';

export class PlayerUseCases {
    constructor(private playerRepository: PlayerRepository) {}

    public createPlayer = async( player: PlayerEntity ) => {
        const newPlayer = new Player(player);
        const playerCreated = await this.playerRepository.createPlayer(newPlayer);
        return playerCreated;
    };
    public findByTokenWallet = async ( token: string ) => {
        const player = await this.playerRepository.findByTokenWallet(token);
        return player;
    }
    public findByUuid = async ( uuid: string ) => {
        const player = await this.playerRepository.findByUuid( uuid );
        return player;
    }
    public updatePlayer = async( uuid: string, dataToUpdate: UpdatePlayerEntity ) => {
        const player = await this.playerRepository.updatePlayer( uuid, dataToUpdate );
        return player;
    };
};