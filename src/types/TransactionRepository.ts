import type { Transaction } from "types/Transaction";

export type TransactionRepository = {
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  addTransaction(expense: Transaction): Promise<void>;
  updateTransaction(expense: Transaction): Promise<void>;
  deleteTransaction(id: string): Promise<void>;
  getUnsyncedTransactions(): Promise<Transaction[]>;
  markAsSynced(id: string): Promise<void>;
};
