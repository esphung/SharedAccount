import { useRepository } from "@domain/providers/RepositoryProvider";
import userDefaultsStorage from "@domain/storage/userDefaultsStorage";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { handleCatchError } from "@presentation/utilities";
import { mergeRecords } from "@utils/listFunctions";
import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Account } from "types/Account";

type IAccountContext = (ReturnType<UseDataSource<Account>> & AccountContextOptions) | undefined;

type AccountContextOptions = {
	currentAccount?: Account;
	selectCurrentAccount: (account: Account) => void;
};

const AccountsContext = createContext<IAccountContext>(undefined);

export const mergeAccounts = (local: Account[] = [], remote: Account[] = []) => {
	return local.map((localAccount) => {
		const remoteAccount = remote.find((acct) => acct.id === localAccount.id);
		if (remoteAccount) {
			return { ...localAccount, ...remoteAccount };
		}
		return localAccount;
	});
};

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
	// repositories
	const { localAccountRepo, remoteAccountRepo } = useRepository();

	// state
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [currentAccount, setCurrentAccount] = useState<Account>();

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
			console.info("[AccountsProvider] Fetched accounts:", mergedAccounts?.length, {
				remote: remote.length,
				local: local.length,
				merged: mergedAccounts.length,
			});
		}
		return mergedAccounts;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Delete a account
	const deleteItem = useCallback(async (id: string) => {
		setAccounts((prevState: Account[]) => prevState.filter((item) => item.id !== id));
		await localAccountRepo.delete(id).catch(handleCatchError("AccountsProvider:deleteItem"));
		return remoteAccountRepo.delete(id).catch(handleCatchError("AccountsProvider:deleteItem"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Add a account
	const addItem = useCallback(
		async (params: Partial<Account>) => {
			const { startingBalance = 0, name = "New Account", version = 1 } = params;
			const acctId = params.id || `acct_${new Date().getTime()}`;
			const newAccount: Account = {
				id: acctId,
				startingBalance,
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

	const selectCurrentAccount = useCallback((account: Account) => {
		setCurrentAccount(account);
		userDefaultsStorage
			.saveItem("account", account.id)
			.catch(handleCatchError("AccountsProvider"));
	}, []);

	/* Side Effects */
	// Use storage to set the current account when accounts are fetched
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
					contextValue?.selectCurrentAccount(account);
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accounts]);

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

	// Fetch accounts when the provider mounts
	useEffect(
		() => {
			fetchItems().then((fetchedAccounts) => {
				if (fetchedAccounts.length) {
					// If accounts are fetched, set them in state
					setAccounts(fetchedAccounts);
					setCurrentAccount(fetchedAccounts[0]);
				} else {
					console.warn("[AccountsProvider] No accounts found, consider adding one.");
				}
			});
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
			currentAccount,
			selectCurrentAccount,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[accounts, currentAccount]
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
