import { mergeAccounts } from "@domain/providers/AccountsProvider.helpers";
import { useRepository } from "@domain/providers/RepositoryProvider";
import userDefaultsStorage from "@domain/storage/userDefaultsStorage";
import { selectCurrentUserId, selectSetAccountSlice } from "@domain/stores/zustand/selectors";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { useStore } from "@stores/zustand/useStore";
import { mergeRecords } from "@utils/listFunctions";
import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Account } from "types/Account";

const AccountsContext = createContext<ReturnType<UseDataSource<Account>> | undefined>(undefined);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
	/* Repositories */
	const { localAccountRepo, remoteAccountRepo, remoteAccountUsersRepo } = useRepository();

	/* State */
	const [accounts, setAccounts] = useState<Account[]>([]);

	/* Store Selectors */
	const { setAccount: setCurrentAccount, account: selectedAccount } =
		useStore(selectSetAccountSlice);
	const currentUserId = useStore(selectCurrentUserId);

	/* Callbacks */
	// Fetch accounts from both local and remote repositories, merging them
	const fetchItems = useCallback(async () => {
		const local = await localAccountRepo.getAll();
		const remote = await remoteAccountRepo.getAll();
		const mergedAccounts = await mergeRecords<Account>({
			local: {
				list: local,
				add: async (item: Account) => {
					return localAccountRepo.add(item).catch((error) => {
						console.error("[AccountsProvider] Error adding local account:", error);
					});
				},
				update: async (item: Account) => {
					return localAccountRepo.update(item).catch((error) => {
						console.error("[AccountsProvider] Error updating local account:", error);
					});
				},
			},
			remote: {
				list: remote,
				update: async (item: Account) => {
					return remoteAccountRepo.update(item).catch((error) => {
						console.error("[AccountsProvider] Error updating remote account:", error);
					});
				},
				add: async (item: Account) => {
					return remoteAccountRepo.add(item).catch((error) => {
						console.error("[AccountsProvider] Error adding remote account:", error);
					});
				},
			},
		});
		if (__DEV__) {
			console.info("[AccountsProvider] Fetched accounts:", mergedAccounts.length, {
				remote: remote.length,
				local: local.length,
				merged: mergedAccounts.length,
			});
		}
		return mergedAccounts;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Delete an account
	const deleteItem = useCallback(async (id: string) => {
		setAccounts((prevState: Account[]) => prevState.filter((item) => item.id !== id));
		await localAccountRepo.delete(id).catch((error) => {
			console.error("[AccountsProvider] Error deleting local account:", error);
		});
		return remoteAccountRepo.delete(id).catch((error) => {
			console.error("[AccountsProvider] Error deleting remote account:", error);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Add an account
	const addItem = useCallback(
		async (params: Partial<Account>) => {
			const { startingBalance = 0, name = "New Account", version = 0 } = params;
			const acctId = params.id || `acct_${new Date().getTime()}`;
			const newAccount: Account = {
				id: acctId,
				startingBalance,
				name,
				version,
			};
			setAccounts((prevState: Account[]) => [...prevState, newAccount]);

			await remoteAccountRepo.add(newAccount).catch((error) => {
				console.error("[AccountsProvider] Error adding remote account:", error);
			});
			await localAccountRepo.add(newAccount).catch((error) => {
				console.error("[AccountsProvider] Error adding local account:", error);
			});

			if (!currentUserId) {
				console.warn(
					"[AccountsProvider] No current user ID found, cannot add account user."
				);
				return;
			}

			// create account_users entry for the current user
			await remoteAccountUsersRepo
				.add({
					id: Date.now(),
					sharedAccountId: acctId,
					userId: currentUserId,
					role: "admin",
					accepted: true,
				})
				.then(() => {
					console.info(
						"[AccountsProvider] Added account_user for current user:",
						currentUserId
					);
				})
				.catch((error) => {
					console.error("[AccountsProvider] Error adding account_user remote:", error);
				});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentUserId]
	);

	const updateItem = useCallback(
		async (item: Account) => {
			setAccounts((prevState: Account[]) => {
				return prevState.map((account) => (account.id === item.id ? item : account));
			});
			await remoteAccountRepo.update(item).catch((error) => {
				console.error("[AccountsProvider] Error updating remote account:", error);
			});
			return localAccountRepo.update(item).catch((error) => {
				console.error("[AccountsProvider] Error updating local account:", error);
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	// Start listening for live updates
	const startListening = useCallback(() => {
		const onUpdate = (updates: Account[]) => {
			setAccounts((prevState: Account[]) => {
				return mergeAccounts(prevState, updates);
			});
		};

		// Subscribe to live updates
		localAccountRepo.getLiveData(onUpdate);

		return () => {
			// Unsubscribe when component unmounts
			localAccountRepo.stopListening();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* Side Effects */
	// Fetch accounts when the component mounts
	useEffect(() => {
		fetchItems()
			.then(setAccounts)
			.catch((error) => {
				console.error("[AccountsProvider] Error fetching accounts:", error);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Set the current account if it is not already set
	useEffect(() => {
		if (!selectedAccount && accounts.length > 0) {
			// Get the last selected account from local storage
			userDefaultsStorage
				.getItem("account")
				.then((lastSelectedAccountId) => {
					if (lastSelectedAccountId) {
						const lastSelectedAccount = accounts.find(
							(account) => account.id === lastSelectedAccountId
						);
						if (lastSelectedAccount) {
							setCurrentAccount(lastSelectedAccount);
						} else {
							// If the last selected account is not found, select the first account
							setCurrentAccount(accounts[0]);
						}
					} else {
						// If no last selected account, select the first account
						setCurrentAccount(accounts[0]);
					}
				})
				.catch((error) => {
					console.error("[AccountsProvider] Error getting last selected account:", error);
					// Fallback to selecting the first account if there's an error
					if (accounts.length > 0) {
						setCurrentAccount(accounts[0]);
					}
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accounts, selectedAccount]);

	// Update the current account in local storage when it changes
	useEffect(() => {
		if (selectedAccount) {
			userDefaultsStorage.saveItem("account", selectedAccount.id).catch((error) => {
				console.error(
					"[AccountsProvider] Error setting current account in storage:",
					error
				);
			});
		}
	}, [selectedAccount]);

	// Subscribe to live updates
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

	// Return the accounts and functions to interact with them
	const contextValue = useMemo(
		() => ({
			state: accounts,
			fetchItems,
			deleteItem,
			addItem,
			startListening,
			updateItem,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[accounts]
	);

	return <AccountsContext.Provider value={contextValue}>{children}</AccountsContext.Provider>;
};

// Custom hook for consuming the context
export const useAccountsContext = () => {
	const context = useContext(AccountsContext);
	if (!context) {
		throw new Error("useAccountsContext must be used within a AccountsProvider");
	}
	return context;
};
