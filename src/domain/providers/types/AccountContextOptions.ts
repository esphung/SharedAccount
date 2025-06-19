import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

export type AccountContextOptions = {
	currentAccount?: Account;
	addTransaction: (
		input: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">,
		accountId: Account["id"]
	) => Promise<void>;
	deleteTransaction: (txnId: Transaction["id"], accountId: Account["id"]) => Promise<void>;
	selectCurrentAccount: (account: Account) => void;
};
