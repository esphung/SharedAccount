import type { Transaction } from "@data/models/types/Transaction";

type LocalTransaction = { toJSON(): Transaction } | Transaction;

const TransactionAdapter = {
	localToState(local: LocalTransaction): Transaction {
		const json = "toJSON" in local ? local.toJSON() : local;
		const transaction: Transaction = {
			...json,
			date: new Date(json.date),
			amount: Number(json.amount),
			version: Number(json.version) || 0,
		};
		return transaction;
	},
	stateToRemote(state: Transaction) {
		return {
			...state,
			date: new Date(state.date),
			amount: Number(state.amount), // Ensure amount is a number
			version: Number(state.version) || 0, // Ensure version is a number
		};
	},
	remoteToState(remote: Transaction): Transaction {
		return {
			...remote,
			date: new Date(remote.date), // Convert ISO string back to Date
			amount: Number(remote.amount), // Ensure amount is a number
			version: Number(remote.version) || 0, // Ensure version is a number
		};
	},
};

export default TransactionAdapter;
