import type { DataModelAdapter } from "types/DataModelAdapter";
import type { Transaction } from "types/Transaction";

type LocalTransaction = { toJSON(): object };

const TransactionAdapter: DataModelAdapter<Transaction, LocalTransaction> = {
  localToState(local): Transaction {
    const json = JSON.parse(JSON.stringify(local));
    const parsed = JSON.parse(JSON.stringify(json));
    const transaction: Transaction = {
      ...parsed,
      date: new Date(parsed.date),
    };
    return transaction;
  },
};

export default TransactionAdapter;
