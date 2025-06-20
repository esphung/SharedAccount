import type { Account } from "types/Account";

export const mergeAccounts = (previous: Account[], updates: Account[]): Account[] => {
	const updatedState = previous.map((account) => {
		const updatedAccount = updates.find((updated) => updated.id === account.id);
		if (updatedAccount) {
			return {
				...account,
				...updatedAccount,
			};
		}
		return account;
	});
	return updatedState;
};
