import RepositoryFactory from "@data/repositories/RepositoryFactory";
import type {DataModelRepository} from "@data/types/DataModelRepository";
import type {PropsWithChildren} from "react";
import React, {createContext, useContext} from "react";
import type {Account} from "types/Account";
import type {Transaction} from "types/Transaction";

type Props = PropsWithChildren<{
	// add props here
}>;

const RepositoryProvider: React.FC<Props> = ({children}) => {
	const localTransactionRepo = RepositoryFactory.createTransactionRepository();
	const localAccountRepo = RepositoryFactory.createAccountRepository();
	const remoteAccountRepo = RepositoryFactory.createRemoteAccountRepository();
	return (
		<RepositoryContext.Provider value={{localTransactionRepo, localAccountRepo, remoteAccountRepo}}>
			{children}
		</RepositoryContext.Provider>
	);
};

const RepositoryContext = createContext<{
	localTransactionRepo: DataModelRepository<Transaction>;
	localAccountRepo: DataModelRepository<Account>;
	remoteAccountRepo: DataModelRepository<Account>;
} | null>(null);

export const useRepository = (): {
	localTransactionRepo: DataModelRepository<Transaction>;
	localAccountRepo: DataModelRepository<Account>;
	remoteAccountRepo: DataModelRepository<Account>;
} => {
	const context = useContext(RepositoryContext);
	if (!context) {
		throw new Error("useRepository must be used within a RepositoryProvider");
	}
	return context;
};

export default RepositoryProvider;
