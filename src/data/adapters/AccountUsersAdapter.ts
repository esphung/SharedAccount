import type { AccountUsers } from "@data/types/AccountUsers";

const AccountUsersAdapter = {
	localToState(local: AccountUsers): AccountUsers {
		return {
			...local,
			accepted: Boolean(local.accepted) || false,
			id: Number(local.id),
			role: local.role || "viewer",
		};
	},
	stateToRemote(state: AccountUsers): Partial<AccountUsers> {
		return {
			...state,
			accepted: Boolean(state.accepted) || false,
			id: Number(state.id),
			role: state.role || "viewer",
		};
	},
	remoteToState(remote: AccountUsers): AccountUsers {
		return {
			...remote,
			accepted: Boolean(remote.accepted) || false,
			id: Number(remote.id),
			role: remote.role || "viewer",
		};
	},
	stateToLocal(state: AccountUsers): AccountUsers {
		return {
			...state,
			accepted: Boolean(state.accepted) || false,
			id: Number(state.id),
			role: state.role || "viewer",
		};
	},
};

export default AccountUsersAdapter;
