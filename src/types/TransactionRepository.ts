import type { Transaction } from "types/Transaction";

export type TransactionRepository = {
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  addTransaction(transaction: Transaction): Promise<void>;
  updateTransaction(transaction: Transaction): Promise<void>;
  deleteTransaction(id: string): Promise<void>;
  getUnsyncedTransactions(): Promise<Transaction[]>;
  markAsSynced(id: string): Promise<void>;
  getLiveTransactions(callback: (transactions: Transaction[]) => void): void; // Reactivity
  stopListening(): void; // Stop listeners when unmounted
};
