import RepositoryFactory from "@data/repositories/RepositoryFactory";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import { useStore } from "@stores/zustand/useStore";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

/**
 * RepositoryProvider is a React context provider that initializes and provides access
 * to various data repositories used in the application.
 *
 * It creates local and remote repositories for transactions and accounts, and provides
 * them to the components that need access to these repositories.
 *
 * The provider also retrieves the authentication token from the Zustand store to
 * initialize remote repositories.
 */
const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// This function retrieves the token from the Zustand store
	const getTokenCallback = useCallback(() => {
		// Access the store directly without the hook
		return useStore.getState().authentication.token || null;
	}, []); // Empty dependency array since we're always getting fresh state

	const contextValue = useMemo(() => {
		// Move repository creation inside useMemo to prevent recreation on every render
		console.info("[RepositoryProvider] Creating repositories");
		const localTransactionRepo = RepositoryFactory.createTransactionRepository();
		const localAccountRepo = RepositoryFactory.createAccountRepository();
		const remoteAccountRepo = RepositoryFactory.createRemoteAccountRepository(getTokenCallback);
		const remoteTransactionRepo =
			RepositoryFactory.createRemoteTransactionRepository(getTokenCallback);
		console.info("[RepositoryProvider] Repositories created");

		return {
			localTransactionRepo,
			localAccountRepo,
			remoteAccountRepo,
			remoteTransactionRepo,
		};
	}, [getTokenCallback]); // Include getTokenCallback as dependency

	return <RepositoryContext.Provider value={contextValue}>{children}</RepositoryContext.Provider>;
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
