import type {DataModelAdapter} from "@data/types/DataModelAdapter";
import type {Account} from "types/Account";
import TransactionAdapter from "./TransactionAdapter";

type LocalAccount = {toJSON(): object};

type IAccountAdapter = DataModelAdapter<Account, LocalAccount, Account>;

const AccountAdapter: IAccountAdapter = {
	localToState(local) {
		const json = local.toJSON ? local.toJSON() : local;
		const parsed = JSON.parse(JSON.stringify(json));
		const transactions = [...(parsed.transactions || [])].map(TransactionAdapter.localToState);
		return {
			...parsed,
			startingBalance: Number(parsed.startingBalance) || 0,
			transactions,
			version: Number(parsed.version),
			name: parsed.name || "",
		};
	},
	stateToRemote(state) {
		return {
			...state,
			startingBalance: Number(state.startingBalance) || 0,
			version: Number(state.version),
			name: state.name || "",
		};
	},
	remoteToState(remote) {
		return {
			...remote,
			startingBalance: Number(remote.startingBalance) || 0,
			version: Number(remote.version),
			name: remote.name || "",
		};
	},
};

export default AccountAdapter;
