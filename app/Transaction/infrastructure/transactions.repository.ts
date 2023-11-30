import { CreditWalletRequest } from 'App/Shared/Interfaces/wallet.interfaces'
import { TransactionEntity, TypesTransaction } from '../domain/transactions.entity'
import { TransactionsRepository } from '../domain/transactions.repository'
import { saveTransaction } from '../functions/createTransaction'
import Redis from '@ioc:Adonis/Addons/Redis'
import { exchangeCurrencyByDollar } from 'App/Shared/Helpers/utils-functions'

import { CurrencyUseCases } from 'App/Currencies/application/currencyUseCases'
import { RoundUseCases } from 'App/Round/application/round.use-cases'

export class TransactionsMongoRepository implements TransactionsRepository {
  constructor(private roundUseCases: RoundUseCases, private currencyUseCases: CurrencyUseCases) { }

  public createTransaction = async (transaction: TransactionEntity): Promise<void> => {
    try {
      await saveTransaction(transaction)
    } catch (error) {
      throw error
    }
  }

  public saveCredits = async (data: any): Promise<void> => {
    const parsedData = JSON.parse(data)
    for (let i = 0; i < parsedData.length; i++) {
      const toWallet: CreditWalletRequest = parsedData[i].toWallet
      const playerWallet = parsedData[i].wallet

      const { player, game, bet } = parsedData[i].toWallet

      const { lastBalance: balanceWallet } = playerWallet
      const userBalance = typeof balanceWallet === 'string' ? Number(balanceWallet) : 0

      const round = await this.roundUseCases.findRoundByUuid(toWallet.round_id)
      const playersOnline = (await Redis.get(`players-online:${toWallet.game_id}`)) || '[]'
      const currency = await this.currencyUseCases.getCurrencyByUuid(player.currencyUuid)

      const currencyExchangeDollar = exchangeCurrencyByDollar(currency!)

      this.createTransaction({
        amount: toWallet.amount,
        platform: 'desktop',
        playerCountry: 'ves',
        userAgent: 'none',
        playerIp: 'none',
        userBalance,
        typeTransaction: TypesTransaction.credit,
        round,
        usersOnline: playersOnline.length,
        player,
        game,
        bet,
        amountExchangeDollar: toWallet.amount * currencyExchangeDollar,
        currencyExchangeDollar,
        currency: currency!,
      })
    }
  }
}
