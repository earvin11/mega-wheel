import { HttpContext } from '@adonisjs/core/build/standalone';
import { RoundUseCases } from '../application/round.use-cases';

export class RoundController {
    constructor(
        private roundUseCases: RoundUseCases
    ) {}

    public createRound = async ({ request, response }: HttpContext) => {
        try {
            const {
                gameUuid,
                providerId,
                start_date = 'algo',
                end_date = 'algo+1',
            } = request.body();

            const identifierNumber = 'algo-m1';

            const newRound = await this.roundUseCases.createRound({
                gameUuid,
                identifierNumber,
                providerId,
                start_date,
                end_date,            
            });

            response.ok({ message: 'Round created', round: newRound });
        } catch (error) {
            console.log('ERROR CREATE ROUND -> ', error);
            response.internalServerError({ error: 'TALK TO ADMINISTRATOR' });
        }
    };
}