import { Transaction } from '../domain/transaction.value';
import { TransactionEntity } from '../domain/transactions.entity';
import { TransactionsRepository } from '../domain/transactions.repository'

export class TransactionsUseCases {
  constructor(private readonly transactionRepository: TransactionsRepository) { }

  public createTransaction = async (transaction: TransactionEntity) => {
    try {
      const newTransaction = new Transaction(transaction)
      this.transactionRepository.createTransaction(newTransaction)
    } catch (err) {
      throw err
    }
  }

  public saveCredits = async (data) => {
    try {
      this.transactionRepository.saveCredits(data)
    } catch (error) {
      throw error
    }
  }
}
