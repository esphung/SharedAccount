import { mergeAccounts } from "@domain/providers/AccountsProviderHelpers";
import useAccountSync from "@domain/providers/hooks/useAccountSync";
import { useRepository } from "@domain/providers/RepositoryProvider";
import type { AccountContextOptions } from "@domain/providers/types/AccountContextOptions";
import userDefaultsStorage from "@domain/storage/userDefaultsStorage";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { handleCatchError } from "@presentation/utilities";
import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

type IAccountContext = (ReturnType<UseDataSource<Account>> & AccountContextOptions) | undefined;

const AccountsContext = createContext<IAccountContext>(undefined);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
	// repositories
	const { localAccountRepo, localTransactionRepo, remoteAccountRepo, remoteTransactionRepo } =
		useRepository();

	// custom hook for syncing accounts
	const { syncAccounts } = useAccountSync();

	// state
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [currentAccount, setCurrentAccount] = useState<Account>();

	const fetchItems = useCallback(async () => {
		const [allLocalTransactions, allRemoteTransactions] = await Promise.all([
			localTransactionRepo.getAll(),
			remoteTransactionRepo.getAll(),
		]).catch(handleCatchError("AccountsProvider"));

		/* Accounts */
		// Sync local accounts with remote accounts
		const syncedAccounts = await syncAccounts();

		/* Transactions */
		// Sync local transactions with remote transactions
		const unsyncedTransactions = allLocalTransactions.filter(
			(localTransaction) =>
				!allRemoteTransactions.some(
					(remoteTransaction) => remoteTransaction.id === localTransaction.id
				)
		);
		if (unsyncedTransactions.length) {
			await Promise.all(
				unsyncedTransactions.map((transaction: Transaction) => {
					return remoteTransactionRepo
						.add(transaction)
						.catch(handleCatchError("AccountsProvider:remoteTransactionAdd"));
				})
			);
		}

		// Set the transactions for each account
		const updatedAccts = syncedAccounts.map((account: Account) => {
			const transactions = allLocalTransactions.filter(
				(transaction: Transaction) => transaction.sharedAccountId === account.id
			);
			account.transactions = transactions;
			return account;
		});

		return updatedAccts;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentAccount?.id]);

	// Delete a account
	const deleteItem = useCallback(async (id: string) => {
		setAccounts((prevState: Account[]) => prevState.filter((item) => item.id !== id));
		await remoteAccountRepo.delete(id).catch(handleCatchError("AccountsProvider:deleteItem"));
		return localAccountRepo.delete(id).catch(handleCatchError("AccountsProvider:deleteItem"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Add a account
	const addItem = useCallback(
		async (params: Partial<Account>) => {
			const { name = "", startingBalance = 0, transactions = [], version = 0 } = params;
			const acctId = params.id || `acct_${new Date().getTime()}`;
			const newAccount: Account = {
				id: acctId,
				startingBalance,
				transactions,
				name,
				version,
			};
			setAccounts((prevState: Account[]) => [...prevState, newAccount]);

			await remoteAccountRepo
				.add(newAccount)
				.catch(handleCatchError("AccountsProvider:remoteAdd"));
			return localAccountRepo
				.add(newAccount)
				.catch(handleCatchError("AccountsProvider:localAdd"));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const updateCurrentAccount = useCallback(
		(list: Account[]) => {
			const newCurrentAcct = list.find((acct) => acct.id === currentAccount?.id) || list[0];
			setCurrentAccount(newCurrentAcct); // pick first account by default
		},
		[currentAccount?.id]
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
		localAccountRepo.getLiveData(onUpdate);

		return () => {
			// Unsubscribe when component unmounts
			localAccountRepo.stopListening();
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
			const account = await localAccountRepo.getById(accountId);
			if (!account) {
				throw new Error("[AccountsProvider:deleteTransaction] Account not found");
			}
			account.transactions = account.transactions.filter(
				(transaction: Transaction) => transaction.id !== txnId
			);

			const txn = await localTransactionRepo.getById(txnId);
			if (!txn) {
				throw new Error("[AccountsProvider:deleteTransaction] Transaction not found");
			}

			// Update the account in the repository
			await remoteAccountRepo
				.update({
					...account,
					transactions: account.transactions,
					version: account.version + 1,
				})
				.catch(handleCatchError("AccountsProvider.remoteUpdate"));
			await localAccountRepo
				.update({
					...account,
					transactions: account.transactions,
					version: account.version + 1,
				})
				.catch(handleCatchError("AccountsProvider"));

			// Delete the transaction from the repository
			await localTransactionRepo.delete(txn.id).catch(handleCatchError("AccountsProvider"));

			// Update the local state
			setAccounts((prevState: Account[]) => {
				const updatedState = prevState.map((acct) => {
					if (acct.id === accountId) {
						return {
							...acct,
							transactions: acct.transactions.filter(
								(transaction: Transaction) => transaction.id !== txnId
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
		[]
	);

	const addTransaction = useCallback(
		async (
			input: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">,
			accountId: Account["id"]
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
				userId: userId || "usr_current_id", // Replace with actual user ID logic
				type,
			};
			// Add the transaction to the repository
			await localTransactionRepo.add(txnParams).catch(handleCatchError("AccountsProvider"));

			// Update the account in the repository
			const account = await localAccountRepo.getById(accountId);
			if (!account) {
				throw new Error("[AccountsProvider:addTransaction] Account not found");
			}
			const updatedAccount = {
				...account,
				transactions: [...(account?.transactions || []), txnParams],
				version: account.version + 1,
			};
			await remoteAccountRepo
				.update(updatedAccount)
				.catch(handleCatchError("AccountsProvider.remoteUpdate"));
			return localAccountRepo
				.update(updatedAccount)
				.catch(handleCatchError("AccountsProvider.localUpdate"));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const selectCurrentAccount = useCallback((account: Account) => {
		setCurrentAccount(account);
		userDefaultsStorage
			.saveItem("account", account.id)
			.catch(handleCatchError("AccountsProvider"));
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
		[accounts, currentAccount]
	);

	// side effects
	useEffect(() => {
		if (!accounts?.length) {
			return;
		}
		userDefaultsStorage.getItem("account").then((accountId) => {
			if (accountId) {
				const account = accounts?.find(
					(acct: Account | undefined) => acct?.id === accountId
				);
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
		[]
	);

	useEffect(
		() => {
			fetchItems().then((fetchedAccounts) => {
				if (fetchedAccounts.length) {
					updateCurrentAccount(fetchedAccounts);
					setAccounts(fetchedAccounts);
				} else {
					console.warn("[AccountsProvider] No accounts found, consider adding one.");
				}
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
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
