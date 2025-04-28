import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

const createMockAccountRepo = (accounts: Account[] = []) => ({
  getLive: jest.fn((callback: (data: Account[]) => void) => {
    callback(accounts);
  }),
  stopListening: jest.fn(),
  getAll: jest.fn(() => Promise.resolve(accounts)),
  getById: jest.fn((id: string) => Promise.resolve(accounts.find((account) => account.id === id))),
  add: jest.fn(),
  update: jest.fn((account: Account) => {
    const index = accounts.findIndex((a) => a.id === account.id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...account };
    }
    return Promise.resolve(accounts[index]);
  }),
  delete: jest.fn((id: string) => {
    const index = accounts.findIndex((account) => account.id === id);
    if (index !== -1) {
      accounts.splice(index, 1);
    }
    return Promise.resolve();
  }),
  getUnsynced: jest.fn(() => Promise.resolve([])),
  markAsSynced: jest.fn(),
});

const createMockTransactionRepo = (transactions: Transaction[] = []) => ({
  getAll: jest.fn(() => Promise.resolve(transactions)),
  getLive: jest.fn((callback: (data: Transaction[]) => void) => {
    callback(transactions);
  }),
  stopListening: jest.fn(),
  getById: jest.fn((id: string) => Promise.resolve(transactions.find((transaction) => transaction.id === id))),
  add: jest.fn((transaction: Transaction) => {
    const existingTransaction = transactions.find((t) => t.id === transaction.id);
    if (existingTransaction) {
      const index = transactions.findIndex((t) => t.id === transaction.id);
      transactions[index] = { ...transactions[index], ...transaction };
    }
    transactions.push(transaction);
    return Promise.resolve(transaction);
  }),
  update: jest.fn(),
  delete: jest.fn((id: string) => {
    const index = transactions.findIndex((transaction) => transaction.id === id);
    if (index !== -1) {
      transactions.splice(index, 1);
    }
    return Promise.resolve();
  }),
  getUnsynced: jest.fn(() => Promise.resolve([])),
  markAsSynced: jest.fn(),
});

export const createMockRepos = ({
  accounts = [],
  transactions = [],
}: {
  accounts: Account[];
  transactions: Transaction[];
}) => ({
  accountRepo: createMockAccountRepo(accounts),
  transactionRepo: createMockTransactionRepo(transactions),
});
