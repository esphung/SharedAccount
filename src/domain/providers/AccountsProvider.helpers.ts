import type { Account } from "types/Account";

export const mergeAccounts = (local: Account[] = [], remote: Account[] = []) => {
	return local.map((localAccount) => {
		const remoteAccount = remote.find((acct) => acct.id === localAccount.id);
		if (remoteAccount) {
			return { ...localAccount, ...remoteAccount };
		}
		return localAccount;
	});
};
