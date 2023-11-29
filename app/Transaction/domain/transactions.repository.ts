import { TransactionEntity } from './transactions.entity'

export interface TransactionsRepository {
  createTransaction(transaction: TransactionEntity): Promise<void>
}
