import { TransactionEntity } from '../domain/transactions.entity';
import { TransactionsRepository } from '../domain/transactions.repository'

export class TransactionsUseCases {
  constructor(private readonly transactionRepository: TransactionsRepository) { }

  public createTransaction = async (transaction: TransactionEntity) => {
    try {
      this.transactionRepository.createTransaction(transaction)
    } catch (err) {
      throw err
    }
  }
}
