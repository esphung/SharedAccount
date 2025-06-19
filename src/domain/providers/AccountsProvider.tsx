import { mergeAccounts } from "@domain/providers/AccountsProviderHelpers";
import useAccountSync from "@domain/providers/hooks/useAccountSync";
import { useRepository } from "@domain/providers/RepositoryProvider";
import userDefaultsStorage from "@domain/storage/userDefaultsStorage";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { handleCatchError } from "@presentation/utilities";
import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Account } from "types/Account";

type IAccountContext = (ReturnType<UseDataSource<Account>> & AccountContextOptions) | undefined;

type AccountContextOptions = {
	currentAccount?: Account;
	selectCurrentAccount: (account: Account) => void;
};

const AccountsContext = createContext<IAccountContext>(undefined);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
	// repositories
	const { localAccountRepo, remoteAccountRepo } = useRepository();

	// custom hook for syncing accounts
	const { syncAccounts } = useAccountSync();

	// state
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [currentAccount, setCurrentAccount] = useState<Account>();

	const fetchItems = useCallback(async () => {
		return syncAccounts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	// Return the accounts and functions to interact with them
	const memoizedValue = useMemo(
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
