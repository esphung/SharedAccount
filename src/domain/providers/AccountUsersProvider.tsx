import type { AccountUsers } from "@data/types/AccountUsers";
import { useStore } from "@domain/stores/zustand/useStore";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useRepository } from "./RepositoryProvider";

type AccountUsersContextProps = ReturnType<UseDataSource<AccountUsers>>;

const AccountUsersContext = createContext<AccountUsersContextProps | undefined>(undefined);

export const AccountUsersProvider = ({ children }: { children: React.ReactNode }) => {
	// repositories
	const { remoteAccountUsersRepo } = useRepository();

	// store
	const currentAccountId = useStore((state) => state.account.account?.id);

	// state
	const state: AccountUsers[] = useMemo(() => [], []);

	// callbacks
	const fetchItems = useCallback(async () => {
		throw new Error("[AccountUsersProvider] Not implemented");
	}, []);

	const addItem = useCallback(
		async (params: Partial<AccountUsers>) => {
			if (!currentAccountId) {
				console.warn(
					"[AccountUsersProvider] No current account ID set, cannot add account_user."
				);
				return;
			}
			try {
				// Construct a full AccountUsers object from params as a workaround for non-type properties
				const {
					id = `account_user_${Date.now()}`,
					userId = "",
					role = "member",
					accepted = false,
				} = params;
				const newAccountUser: AccountUsers = {
					id: Number(id),
					sharedAccountId: currentAccountId,
					userId,
					role: role as AccountUsers["role"],
					accepted,
				};
				await remoteAccountUsersRepo.add(newAccountUser);
			} catch (error) {
				console.error("[AccountUsersProvider] Error adding account user:", error);
			}
		},
		[currentAccountId, remoteAccountUsersRepo]
	);

	const updateItem = useCallback(async (_: AccountUsers) => {
		throw new Error("[AccountUsersProvider] Not implemented");
	}, []);

	const deleteItem = useCallback(async (_: string) => {
		throw new Error("[AccountUsersProvider] Not implemented");
	}, []);
	const startListening = useCallback(() => {
		// This function can be used to set up listeners for real-time updates
		// For now, it does nothing but can be implemented later
		console.info("[AccountUsersProvider] Listening for account users changes");

		return () => {
			// Cleanup function to remove listeners if needed
			console.info("[AccountUsersProvider] Stopped listening for account users changes");
		};
	}, []);

	const memoizedValue: AccountUsersContextProps = useMemo(
		() => ({
			state,
			fetchItems,
			addItem,
			updateItem,
			deleteItem,
			startListening,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[state]
	);

	return (
		<AccountUsersContext.Provider value={memoizedValue}>
			{children}
		</AccountUsersContext.Provider>
	);
};

export const useAccountUsersContext = (): AccountUsersContextProps => {
	const context = useContext(AccountUsersContext);
	if (!context) {
		throw new Error("useAccountUsersContext must be used within an AccountUsersProvider");
	}
	return context;
};
