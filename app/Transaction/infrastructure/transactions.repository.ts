import { TransactionEntity } from '../domain/transactions.entity'
import { TransactionsRepository } from '../domain/transactions.repository'
import TransactionModel from './transactions.model'

export class TransactionsMongoRepository implements TransactionsRepository {
  public createTransaction = async (transaction: TransactionEntity): Promise<void> => {
    try {
      await TransactionModel.create(transaction)
    } catch (error) {
      throw error
    }
  }
}
