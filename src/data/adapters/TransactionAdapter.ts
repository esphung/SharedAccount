import type { Transaction } from "@data/models/types/Transaction";

type LocalTransaction = { toJSON(): Transaction } | Transaction;

const TransactionAdapter = {
	localToState(local: LocalTransaction): Transaction {
		const json = "toJSON" in local ? local.toJSON() : local;
		const transaction: Transaction = {
			...json,
			date: new Date(json.date),
			amount: Number(json.amount),
		};
		return transaction;
	},
	stateToRemote(state: Transaction) {
		return state; // TODO: Implement this when remote API is ready
	},
	remoteToState(remote: Transaction): Transaction {
		return remote;
	},
};

export default TransactionAdapter;
