import type { ScheduledTransaction } from "@data/models/types/ScheduledTransaction";
import type { DataModelAdapter } from "@data/types/DataModelAdapter";

type LocalScheduledTransaction = { toJSON(): object };

const ScheduledTransactionAdapter: DataModelAdapter<ScheduledTransaction, LocalScheduledTransaction> = {
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
