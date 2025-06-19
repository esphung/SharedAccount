import type { Account } from "types/Account";

export const mergeAccounts = (previous: Account[], updates: Account[]): Account[] => {
	const updatedState = previous.map((account) => {
		const updatedAccount = updates.find((updated) => updated.id === account.id);
		if (updatedAccount) {
			return {
				...account,
				...updatedAccount,
				transactions: updatedAccount.transactions.map((updatedTransaction) => {
					const existingTransaction = account.transactions.find(
						(transaction) => transaction.id === updatedTransaction.id
					);
					if (existingTransaction) {
						return {
							...existingTransaction,
							...updatedTransaction,
						};
					}
					return updatedTransaction;
				}),
			};
		}
		return account;
	});
	return updatedState;
};
