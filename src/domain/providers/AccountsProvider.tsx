import {useRepository} from "@domain/providers/RepositoryProvider";
import userDefaultsStorage from "@domain/storage/userDefaultsStorage";
import type {UseDataSource} from "@presentation/types/UseDataSource";
import {handleCatchError} from "@presentation/utilities";
import type {ReactNode} from "react";
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {Account} from "types/Account";
import type {Transaction} from "types/Transaction";

const mergeAccounts = (previous: Account[], updates: Account[]): Account[] => {
	const updatedState = previous.map((account) => {
		const updatedAccount = updates.find((updated) => updated.id === account.id);
		if (updatedAccount) {
			return {
				...account,
				...updatedAccount,
				transactions: updatedAccount.transactions.map((updatedTransaction) => {
					const existingTransaction = account.transactions.find(
						(transaction) => transaction.id === updatedTransaction.id,
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

type AccountsDataSource = ReturnType<UseDataSource<Account>> & {
	currentAccount?: Account;
	addTransaction: (
		input: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">,
		accountId: Account["id"],
	) => Promise<void>;
	deleteTransaction: (txnId: Transaction["id"], accountId: Account["id"]) => Promise<void>;
	selectCurrentAccount: (account: Account) => void;
};
const FAKE_USER_ID = "usr_TEST_USER_ID" as `usr_${string}`;

const AccountsContext = createContext<AccountsDataSource | undefined>(undefined);

export const AccountsProvider = ({children}: {children: ReactNode}) => {
	// repositories
	const {accountRepo, transactionRepo} = useRepository();

	// state
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [currentAccount, setCurrentAccount] = useState<Account>();

	// Memoize the current account to avoid unnecessary re-renders
	const fetchItems = useCallback(async () => {
		const [allTransactions, allAccounts] = await Promise.all([
			transactionRepo.getAll(),
			accountRepo.getAll(),
		]);

		// Set the transactions for each account
		const newState = allAccounts.map((account: Account) => {
			const transactions = allTransactions.filter(
				(transaction: Transaction) => transaction.sharedAccountId === account.id,
			);
			account.transactions = transactions;
			return account;
		});

		// Update the current account if it is not already set
		if (newState.length) {
			updateCurrentAccount(newState);
		}

		// Update the local state with the fetched accounts
		setAccounts(newState);

		return allAccounts;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentAccount?.id]);

	// Delete a account
	const deleteItem = useCallback((id: string) => {
		setAccounts((prevState: Account[]) => prevState.filter((item) => item.id !== id));
		return accountRepo.delete(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Add a account
	const addItem = useCallback(
		(params: Partial<Account>) => {
			const {name = "", startingBalance = 0, transactions = []} = params;
			const acctId = params.id || `acct_${new Date().getTime()}`;
			const newAccount: Account = {
				id: acctId,
				startingBalance,
				transactions,
				name,
			};
			setAccounts((prevState: Account[]) => [...prevState, newAccount]);
			return accountRepo.add(newAccount);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const updateCurrentAccount = useCallback(
		(list: Account[]) => {
			const newCurrentAcct = list.find((acct) => acct.id === currentAccount?.id) || list[0];
			setCurrentAccount(newCurrentAcct); // pick first account by default
		},
		[currentAccount?.id],
	);

	// Start listening for live updates
	const startListening = useCallback(() => {
		const onUpdate = (updates: Account[]) => {
			setAccounts((prevState: Account[]) => {
				const merged = mergeAccounts(prevState, updates);
				updateCurrentAccount(merged);
				return merged;
			});
		};

		// Subscribe to live updates
		accountRepo.getLiveData(onUpdate);

		return () => {
			// Unsubscribe when component unmounts
			accountRepo.stopListening();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentAccount?.id]);

	// Delete a transaction from the current account
	const deleteTransaction = useCallback(
		async (txnId: Transaction["id"], accountId: Account["id"]) => {
			if (!accountId) {
				throw new Error("[AccountsProvider:deleteTransaction] Account ID is required");
			}
			// Update the account in the repository
			const account = await accountRepo.getById(accountId);
			if (!account) {
				throw new Error("[AccountsProvider:deleteTransaction] Account not found");
			}
			account.transactions = account.transactions.filter(
				(transaction: Transaction) => transaction.id !== txnId,
			);

			const txn = await transactionRepo.getById(txnId);
			if (!txn) {
				throw new Error("[AccountsProvider:deleteTransaction] Transaction not found");
			}

			// Update the account in the repository
			await accountRepo.update(account).catch(handleCatchError("AccountsProvider"));

			// Delete the transaction from the repository
			await transactionRepo.delete(txn.id).catch(handleCatchError("AccountsProvider"));

			// Update the local state
			setAccounts((prevState: Account[]) => {
				const updatedState = prevState.map((acct) => {
					if (acct.id === accountId) {
						return {
							...acct,
							transactions: acct.transactions.filter(
								(transaction: Transaction) => transaction.id !== txnId,
							),
						};
					}
					return acct;
				});
				updateCurrentAccount(updatedState);
				return updatedState;
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const addTransaction = useCallback(
		async (
			input: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">,
			accountId: Account["id"],
		) => {
			const {
				id = `txn_${new Date().getTime()}`,
				userId,
				amount = 0,
				category = "",
				date = new Date(),
				type = "expense",
				name = "",
				description,
			} = input;
			// Create the transaction params
			const txnParams: Transaction = {
				id: id || `txn_${new Date().getTime()}`,
				amount,
				name,
				description,
				category,
				date,
				sharedAccountId: accountId,
				userId: userId || FAKE_USER_ID,
				type,
			};
			// Add the transaction to the repository
			await transactionRepo.add(txnParams).catch(handleCatchError("AccountsProvider"));

			// Update the account in the repository
			const account = await accountRepo.getById(accountId);
			if (!account) {
				throw new Error("[AccountsProvider:addTransaction] Account not found");
			}
			await accountRepo
				.update({...account, transactions: [...(account?.transactions || []), txnParams]})
				.catch(handleCatchError("AccountsProvider"));
		},

		[accountRepo, transactionRepo],
	);

	const selectCurrentAccount = useCallback((account: Account) => {
		setCurrentAccount(account);
		userDefaultsStorage.saveItem("account", account.id).catch(handleCatchError("AccountsProvider"));
	}, []);

	// Return the accounts and functions to interact with them
	const memoizedValue = useMemo(
		() => ({
			state: accounts,
			fetchItems,
			deleteItem,
			addItem,
			startListening,
			currentAccount,
			addTransaction,
			deleteTransaction,
			selectCurrentAccount,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[accounts, currentAccount],
	);

	// side effects
	useEffect(() => {
		if (!accounts?.length) {
			return;
		}
		userDefaultsStorage.getItem("account").then((accountId) => {
			if (accountId) {
				const account = accounts?.find((acct: Account | undefined) => acct?.id === accountId);
				if (account) {
					memoizedValue?.selectCurrentAccount(account);
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accounts]);

	useEffect(
		() => {
			const unsub = startListening();
			return () => {
				unsub();
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	useEffect(
		() => {
			fetchItems();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return <AccountsContext.Provider value={memoizedValue}>{children}</AccountsContext.Provider>;
};

// Custom hook for consuming the context
export const useAccountsContext = () => {
	const context = useContext(AccountsContext);
	if (!context) {
		throw new Error("useAccountsContext must be used within a AccountsProvider");
	}
	return context;
};
