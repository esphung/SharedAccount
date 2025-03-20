import type { DataModelAdapter } from "types/DataModelAdapter";
import type { ScheduledTransaction } from "types/ScheduledTransaction";

type LocalScheduledTransaction = { toJSON(): object };

const ScheduledTransactionAdapter: DataModelAdapter<
  ScheduledTransaction,
  LocalScheduledTransaction
> = {
  localToState(local): ScheduledTransaction {
    const parsed = JSON.parse(JSON.stringify(local));
    const transaction: ScheduledTransaction = {
      ...parsed,
      date: new Date(parsed.date),
    };
    return transaction;
  },
};

export default ScheduledTransactionAdapter;
