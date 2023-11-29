export interface LogEntity {
  typeError: TypesLogsErrors;
  request?: any;
  response?: any;
  error?: string;
  ip?: string;
  player?: string;
  uuid?: string;
}

export enum TypesLogsErrors {
  credit = 'credit',
  debit = 'debit',
  rollback = 'rollback'
}

export interface FilterLog {
    typeError?: TypesLogsErrors;
}