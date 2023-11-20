import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ClientUseCases } from 'App/Client/application/ClientUseCases';
import { CurrencyUseCases } from 'App/Currencies/application/currencyUseCases';
import { OperatorUseCases } from 'App/Operator/application/OperatorUseCases';
import { PlayerUseCases } from 'App/Player/application/player.use-cases';
import { PlayerEntity } from 'App/Player/domain/player.entity';
import { loginPllayerInWallet } from 'App/Shared/Helpers/wallet-request';
import { DocumentResponse } from 'App/Shared/Interfaces/document-to-parse.response';
import { WheelFortuneUseCases } from 'App/WheelFortune/apllication/wheel-fortune.use-cases';
import { ChipUseCases } from 'App/Chip/application/ChipUseCase';

export class LaunchController {
    constructor(
        private playerUseCases: PlayerUseCases,
        private operatorUseCases: OperatorUseCases,
        private clientUseCases: ClientUseCases,
        private currencyUseCases: CurrencyUseCases,
        private wheelUseCases: WheelFortuneUseCases,
        private chipUseCases: ChipUseCases
    ) {}

    public launch = async ({ request, response }: HttpContextContract) => {
        const { token, operatorUuid, casinoId, casinoToken } = request.body();
        try {
            // Validar operador
            const operator = await this.operatorUseCases.getOperatorByUuid(operatorUuid)
            if (!operator) return response.notFound({ ok: false, msg: 'Operator not found' })
            if (!operator.status) return response.unauthorized({ ok: false, msg: 'Operator is disabled' })

            // Validar client
            const client = await this.clientUseCases.getClientByUuid(operator.client)
            if (!client) return response.notFound({ ok: false, msg: 'Client not found' })
            if (!client.status) return response.unauthorized({ ok: false, msg: 'Client is disabled' })

            // Loguea al player
            const playerWallet = await loginPllayerInWallet(operator.endpointAuth, token);
            if (!playerWallet.ok) return response.badRequest({ ok: false, msg: playerWallet.msg || 'Player not found' })

            // Valida la currency
            const currency = await this.currencyUseCases.getCurrencyByIsoCode(playerWallet.currency)
            if (!currency) return response.notFound({ ok: false, msg: 'Currency not found' })
            if (!operator?.currencies?.includes(currency.isoCode))
            return response.badRequest({ ok: false, msg: 'Currency not available for operator' })

            let player: PlayerEntity | null

            // Busca al player en la DB
            player = await this.playerUseCases.findByTokenWallet(token)
            if (!player) {
                if (!currency.uuid) return
                player = await this.playerUseCases.createPlayer({
                    userId: playerWallet.userId,
                    currencyUuid: currency.uuid,
                    tokenWallet: token,
                    lastBalance: Number(playerWallet.lastBalance),
                    operator,
                    username: playerWallet.username,
                })
            } else {
                if (!player.status) return response.unauthorized({ ok: false, msg: 'Player disabled' })
                if (!player.uuid) return
                player = await this.playerUseCases.updatePlayer(player.uuid!, {
                    operator,
                    tokenWallet: token,
                    lastBalance: Number(playerWallet.lastBalance),
                })
            }
            // Valida el juego
            const casino = await this.wheelUseCases.getByUuid(casinoId);
            if (!casino) return response.notFound({ ok: false, msg: 'Game not found' });

            const gameLimits = await this.operatorUseCases.getGameAndLimitsInOperator({ operator, gameUuid: casino.uuid! });
            if(!gameLimits) return response.notFound({ error: 'Limits not found' });

            const limits = gameLimits.currencyAndLimits.find(
                currencyLimit => currencyLimit.currency.isoCode === currency.isoCode
            );
            
            if(!limits) return response.notFound({ error: 'Limits not found by currency' });
            const { minBet, maxBet } = limits;

            const chips = await this.chipUseCases.getChipsByOperator(operator.uuid!, currency.isoCode)

            const operatorToRes = this.parseDocument(operator)
            // const clientToRes = this.parseDocument(client)
            const currencyToRes = this.parseDocument(currency)
            const playerToRes = this.parseDocument(player!, 'player')

            response.ok({
                minBet,
                maxBet,
                casino,
                chips,
                player: playerToRes,
                operator: operatorToRes,
                currency: currencyToRes,
            });
        } catch (error) {
            console.log('ERROR IN LAUNCH ->', error);
            response.internalServerError({ message: 'Talk to administrator' });
        }
    }

    private parseDocument(document: DocumentResponse, type?: string) {
        if( type === 'player' ) {
          return {
            userId: document.userId,
            username: document.username,
            uuid: document.uuid,
            currencyUuid: document.currencyUuid,
            lastBalance: document.lastBalance,
            status: document.status,
            isAdmin: document.isAdmin,
            tokenWallet: document.tokenWallet,
            WL: document.WL,
            operator: {
              name: document.operator?.name,
              client: document.operator?.client,
              uuid: document.operator?.uuid
            }
          }
        }
    
        if (type === 'chip') {
          return {
            value: document.value,
            color: document.color,
          }
        }
    
        const dataRes = {
          name: document.name,
          uuid: document.uuid,
        }
    
        if (document.isoCode) dataRes['isoCode'] = document.isoCode
    
        return dataRes
      }
}