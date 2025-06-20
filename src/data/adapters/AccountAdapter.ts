import type { Account } from "types/Account";

type LocalAccount = { toJSON(): Account } | Account;

const AccountAdapter = {
	localToState(local: LocalAccount): Account {
		const json = "toJSON" in local ? local.toJSON() : local;
		return {
			...json,
			startingBalance: Number(json.startingBalance),
			version: Number(json.version),
			name: json.name,
		};
	},
	stateToRemote(state: Account): Partial<Account> {
		return {
			...state,
			startingBalance: Number(state.startingBalance),
			version: Number(state.version),
			name: state.name,
		};
	},
	remoteToState(remote: Account): Account {
		return {
			...remote,
			startingBalance: Number(remote.startingBalance),
			version: Number(remote.version),
			name: remote.name,
		};
	},
	stateToLocal(state: Account): LocalAccount {
		return {
			...state,
			startingBalance: Number(state.startingBalance),
			version: Number(state.version),
			name: state.name,
		};
	},
};

export default AccountAdapter;
