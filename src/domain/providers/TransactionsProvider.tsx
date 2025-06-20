import type { UseDataSource } from "@presentation/types/UseDataSource";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Transaction } from "types/Transaction";
import { useRepository } from "./RepositoryProvider";

type TransactionsContextProps = ReturnType<UseDataSource<Transaction>>;

const TransactionsContext = createContext<TransactionsContextProps | undefined>(undefined);

export const useTransactionSync = () => {
	const { localTransactionRepo, remoteTransactionRepo } = useRepository();

	// between local and remote repositories.
	const syncTransactions = useCallback(async () => {
		const [allLocalTransactions, allRemoteTransactions] = await Promise.all([
			localTransactionRepo.getAll(),
			remoteTransactionRepo.getAll(),
		]);
		const unsyncedTransactions = allLocalTransactions.filter(
			(localTransaction) =>
				!allRemoteTransactions.some(
					(remoteTransaction) => remoteTransaction.id === localTransaction.id
				)
		);

		if (unsyncedTransactions.length) {
			await Promise.all(
				unsyncedTransactions.map((transaction: Transaction) => {
					return remoteTransactionRepo.add(transaction).catch((error) => {
						console.error("[useTransactionSync] Error syncing transaction:", error);
					});
				})
			);
		}

		const syncTransactionsPromises = [...allRemoteTransactions].map(
			(remoteTransaction: Transaction) => {
				// Do sync logic here
				const local = allLocalTransactions.find(
					(localTransaction) => localTransaction.id === remoteTransaction.id
				);
				if (!local) {
					// If the local transaction does not exist, return the remote transaction
					return localTransactionRepo
						.add(remoteTransaction)
						.then(() => remoteTransaction);
				} else if (local.version < remoteTransaction.version) {
					// If the local transaction exists but is outdated, update it with remote data
					return localTransactionRepo
						.update(remoteTransaction)
						.then(() => remoteTransaction);
				} else if (local.version > remoteTransaction.version) {
					return remoteTransactionRepo.update(local).then(() => local);
				}
				// If the local transaction exists, return the local transaction
				return local;
			}
		);

		const syncedTransactions = await Promise.all(syncTransactionsPromises);
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.debug("[useTransactionSync] Synced transactions:", syncedTransactions?.length, {
				remote: allRemoteTransactions.length,
				local: allLocalTransactions.length,
			});
		}
		return syncedTransactions;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { syncTransactions };
};

export const mergeTransactions = (local: Transaction[] = [], remote: Transaction[] = []) => {
	return local.map((localTransaction) => {
		const remoteTransaction = remote.find((txn) => txn.id === localTransaction.id);
		if (remoteTransaction) {
			return { ...localTransaction, ...remoteTransaction };
		}
		return localTransaction;
	});
};

export const TransactionsProvider = ({ children }: { children: React.ReactNode }) => {
	// repositories
	const { localTransactionRepo, remoteTransactionRepo } = useRepository();

	// custom hook for syncing transactions
	const { syncTransactions } = useTransactionSync();

	// state
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const fetchItems = useCallback(async () => {
		// TODO: Implement early return if network is offline
		return syncTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Delete a transaction
	const deleteItem = useCallback(async (id: string) => {
		setTransactions((prevState: Transaction[]) => prevState.filter((item) => item.id !== id));
		// Delete from remote repository first
		await remoteTransactionRepo.delete(id).catch((error) => {
			console.error("[TransactionsProvider] Error deleting transaction:", error);
		});
		// Then delete from local repository
		return localTransactionRepo.delete(id).catch((error) => {
			console.error("[TransactionsProvider] Error deleting transaction:", error);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addItem = useCallback(
		async (params: Partial<Transaction> = {}) => {
			const {
				id,
				amount = 0,
				description = "",
				version = 0,
				date = new Date(),
				name = "",
				category = "",
				type = "expense",
				sharedAccountId = "acct_default",
				userId = "usr_default",
			} = params;
			const txnId = id || `txn_${new Date().getTime()}`;
			const newTransaction: Transaction = {
				id: txnId,
				amount,
				description,
				version,
				date: date instanceof Date ? date : new Date(date),
				name,
				category,
				type,
				sharedAccountId,
				userId,
			};
			setTransactions((prevState: Transaction[]) => [...prevState, newTransaction]);

			// Add to remote repository first
			await remoteTransactionRepo.add(newTransaction).catch((error) => {
				console.error("[TransactionsProvider] Error adding transaction:", error);
			});
			// Then add to local repository
			return localTransactionRepo.add(newTransaction).catch((error) => {
				console.error("[TransactionsProvider] Error adding transaction:", error);
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	// Start listening for live updates
	const startListening = useCallback(() => {
		const onUpdate = (updates: Transaction[]) => {
			setTransactions((prevState: Transaction[]) => {
				return mergeTransactions(prevState, updates);
			});
		};

		// Subscribe to live updates
		localTransactionRepo.getLiveData(onUpdate);

		// Return an unsubscribe function
		return () => {
			localTransactionRepo.stopListening();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* Side Effects */
	// Fetch initial transactions when the provider mounts
	useEffect(() => {
		fetchItems()
			// .then(setTransactions)
			.then((fetchedTransactions) => {
				if (fetchedTransactions?.length) {
					setTransactions(fetchedTransactions);
				} else {
					console.warn("[TransactionsProvider] No transactions found");
				}
			})
			.catch((error) => {
				console.error("[TransactionsProvider] Error fetching transactions:", error);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Subscribe to live updates
	useEffect(() => {
		const unsub = startListening();
		return () => {
			unsub(); // Clean up the subscription on unmount
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const contextValue: TransactionsContextProps = useMemo(
		() => ({
			state: transactions,
			fetchItems,
			deleteItem,
			addItem,
			startListening,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[transactions]
	);

	return (
		<TransactionsContext.Provider value={contextValue}>{children}</TransactionsContext.Provider>
	);
};

export const useTransactionsContext = () => {
	const context = useContext(TransactionsContext);
	if (!context) {
		throw new Error("useTransactionsContext must be used within a TransactionsProvider");
	}
	return context;
};
