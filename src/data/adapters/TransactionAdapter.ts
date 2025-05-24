import type {Transaction} from "@data/models/types/Transaction";
import type {DataModelAdapter} from "@data/types/DataModelAdapter";

type LocalTransaction = {toJSON(): object};

const TransactionAdapter: DataModelAdapter<Transaction, LocalTransaction> = {
	localToState(local): Transaction {
		const json = local.toJSON ? local.toJSON() : local;
		const parsed = JSON.parse(JSON.stringify(json));
		const transaction: Transaction = {
			...parsed,
			date: new Date(parsed.date),
		};
		return transaction;
	},
};

export default TransactionAdapter;
