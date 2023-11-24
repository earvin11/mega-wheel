import { getBetsWinnerByResult, payWinners } from '../../Shared/Helpers/wheel-utils';
import { Bet, BetEntity, BetRepository } from '../domain'
import { BetControlRedisRepository } from '../infraestructure/repositories/bet-control.redis-repository';
import { RoundControlRedisRepository } from '../../Round/infraestructure/repositories/round.control.redis.repository';
import Redis from '@ioc:Adonis/Addons/Redis';

export class BetUseCases {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly betControlRedisRepository: BetControlRedisRepository,
    private readonly roundControlRedisRepository: RoundControlRedisRepository
  ) {}

  public createBet = async (bet: BetEntity) => {
    try {
      const newBet = new Bet(bet)
      const betCreated = await this.betRepository.createBet(newBet)
      return betCreated
    } catch (error) {
      throw error
    }
  }

  public findBetByUuid = async (uuid: string) => {
    try {
      const bet = await this.betRepository.findBetByUuid(uuid)
      return bet
    } catch (error) {
      throw error
    }
  }

  public payBet = async (uuid: string) => {
    try {
      const betIsPaid = await this.betRepository.payBet(uuid)
      return betIsPaid
    } catch (error) {
      throw error
    }
  }
  public getWinner = async (filter: any) => {
    const betWinner = await this.betRepository.getWinner(filter)
    return betWinner
  }
  public getWinners = async (filter: any) => {
    const betWinners = await this.betRepository.getWinners(filter)
    return betWinners
  }
  public findBetsByRoundUuid = async (roundUuid: string) => {
    try {
      const bets = await this.betRepository.findBetsByRoundUuid(roundUuid)
      return bets
    } catch (error) {
      throw error
    }
  }
  public instanceBet = (bet: BetEntity) => {
    const newBet = new Bet(bet);
    return newBet;
  };
  public saveBet = async (bet: BetEntity) => {
    const betSaved = await this.betRepository.createBet(bet);
    return betSaved;
  };
  
  // PAY-BETS
  public payBetsWinner = async (roundUuid: string) => {
    const round = await this.roundControlRedisRepository.getRound(roundUuid);
    if(!round || !round.result) return;

    const { result } = round;

    const bets = await this.betControlRedisRepository.getBetsByRound(roundUuid);
    if(!bets.length) return;

    const betsWinner = getBetsWinnerByResult(bets, result);
    if(!betsWinner.length) return;

    await payWinners({ 
      bets: betsWinner,
      //TODO:
      isoCode: 'USD',
      result,
      roundId: roundUuid 
    });

    Redis.del(`round:${round.uuid}`)
    Redis.del(`bets:${round.uuid}`)
  }
}
