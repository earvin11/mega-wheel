// import { TransactionEntity } from '../domain/transactions.entity'
import TransactionModel from '../infrastructure/transactions.model'

export const saveTransaction = async (transaction) => {
  await TransactionModel.create(transaction)
}
