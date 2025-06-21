import { useRepository } from "@domain/providers/RepositoryProvider";
import { selectCurrentAccount } from "@domain/stores/zustand/selectors";
import { useStore } from "@domain/stores/zustand/useStore";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { mergeRecords } from "@utils/listFunctions";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Transaction } from "types/Transaction";

type TransactionsContextProps = ReturnType<UseDataSource<Transaction>>;

const TransactionsContext = createContext<TransactionsContextProps | undefined>(undefined);

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

	// state
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	// store
	const currentUserId = useStore((state) => state.user.userId);
	const currentAccount = useStore(selectCurrentAccount);

	const fetchItems = useCallback(async () => {
		const local = await localTransactionRepo.getAll();
		const remote = await remoteTransactionRepo.getAll();
		const mergedTransactions = await mergeRecords<Transaction>({
			local: {
				list: local,
				update: async (item: Transaction) => {
					return localTransactionRepo.update(item).catch((error) => {
						console.error(
							"[TransactionsProvider] Error updating local transaction:",
							error
						);
					});
				},
				add: async (item: Transaction) => {
					return localTransactionRepo.add(item).catch((error) => {
						console.error(
							"[TransactionsProvider] Error adding local transaction:",
							error
						);
					});
				},
			},
			remote: {
				list: remote,
				update: async (item: Transaction) => {
					return remoteTransactionRepo.update(item).catch((error) => {
						console.error(
							"[TransactionsProvider] Error updating remote transaction:",
							error
						);
					});
				},
				add: async (item: Transaction) => {
					return remoteTransactionRepo.add(item).catch((error) => {
						console.error(
							"[TransactionsProvider] Error adding remote transaction:",
							error
						);
					});
				},
			},
		});
		if (__DEV__) {
			console.info(
				"[TransactionsProvider] Fetched transactions:",
				mergedTransactions.length,
				{
					remote: remote.length,
					local: local.length,
					merged: mergedTransactions.length,
				}
			);
		}
		return mergedTransactions;
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
		async (params: Partial<Omit<Transaction, "sharedAccountId" | "userId">>): Promise<void> => {
			if (!currentUserId || !currentAccount) {
				console.error(
					"[TransactionsProvider] No current userId or account found to add transaction"
				);
				return;
			}
			const {
				id = `txn_${new Date().getTime()}`,
				amount = 0,
				description = "",
				version = 0,
				date = new Date(),
				name = "",
				category = "",
				type = "expense",
			} = params;
			const newTransaction: Transaction = {
				id,
				amount,
				description,
				version,
				date: date instanceof Date ? date : new Date(date),
				name,
				category,
				type,
				sharedAccountId: currentAccount?.id,
				userId: currentUserId,
			};
			setTransactions((prevState: Transaction[]) => [...prevState, newTransaction]);

			// Add to remote repository first
			await remoteTransactionRepo.add(newTransaction).catch((error) => {
				console.error("[TransactionsProvider] Error adding transaction:", error);
			});
			// Then add to local repository
			await localTransactionRepo.add(newTransaction).catch((error) => {
				console.error("[TransactionsProvider] Error adding transaction:", error);
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentUserId, currentAccount]
	);

	// Start listening for live updates
	const startListening = useCallback(() => {
		const onUpdate = (updates: Transaction[]) => {
			// Merge updates with existing transactions
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

	/* Side effects */
	// Fetch initial transactions when the provider mounts
	useEffect(() => {
		fetchItems()
			.then(setTransactions)
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
		[transactions, addItem]
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
