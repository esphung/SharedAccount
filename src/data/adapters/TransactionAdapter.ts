import type {Transaction} from "@data/models/types/Transaction";
import type {DataModelAdapter} from "@data/types/DataModelAdapter";

type LocalTransaction = {toJSON(): object};

const TransactionAdapter: DataModelAdapter<Transaction, LocalTransaction, Transaction> = {
	localToState(local) {
		const json = local.toJSON ? local.toJSON() : local;
		const parsed = JSON.parse(JSON.stringify(json));
		const transaction: Transaction = {
			...parsed,
			date: new Date(parsed.date),
		};
		return transaction;
	},
	stateToRemote(_state) {
		return _state; // TODO: Implement this when remote API is ready
	},
	remoteToState(remote) {
		return remote;
	},
};

export default TransactionAdapter;
