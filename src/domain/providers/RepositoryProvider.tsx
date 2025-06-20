import RepositoryFactory from "@data/repositories/RepositoryFactory";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import { useStore } from "@stores/zustand/useStore";
import React, { createContext, useCallback, useContext } from "react";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const getTokenCallback = useCallback(() => {
		// Always get the current token from store, not the captured one
		const currentToken = useStore.getState().authentication.token;
		if (!currentToken) {
			console.warn("[RepositoryProvider] No token found, returning null");
			return null;
		}
		return currentToken;
	}, []); // Empty dependency array since we're always getting fresh state

	// Create repositories (can be outside useMemo since getTokenCallback is stable)
	const localTransactionRepo = RepositoryFactory.createTransactionRepository();
	const localAccountRepo = RepositoryFactory.createAccountRepository();
	const remoteAccountRepo = RepositoryFactory.createRemoteAccountRepository(getTokenCallback);
	const remoteTransactionRepo =
		RepositoryFactory.createRemoteTransactionRepository(getTokenCallback);

	return (
		<RepositoryContext.Provider
			value={{
				localTransactionRepo,
				localAccountRepo,
				remoteAccountRepo,
				remoteTransactionRepo,
			}}
		>
			{children}
		</RepositoryContext.Provider>
	);
};

const RepositoryContext = createContext<{
	localTransactionRepo: DataModelRepository<Transaction, "local">;
	localAccountRepo: DataModelRepository<Account, "local">;
	remoteAccountRepo: DataModelRepository<Account, "remote">;
	remoteTransactionRepo: DataModelRepository<Transaction, "remote">;
} | null>(null);

export const useRepository = (): {
	localTransactionRepo: DataModelRepository<Transaction, "local">;
	localAccountRepo: DataModelRepository<Account, "local">;
	remoteAccountRepo: DataModelRepository<Account, "remote">;
	remoteTransactionRepo: DataModelRepository<Transaction, "remote">;
} => {
	const context = useContext(RepositoryContext);
	if (!context) {
		throw new Error("useRepository must be used within a RepositoryProvider");
	}
	return context;
};

export default RepositoryProvider;
