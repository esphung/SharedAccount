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
	const transactionRepo = RepositoryFactory.createTransactionRepository();
	const accountRepo = RepositoryFactory.createAccountRepository();
	return (
		<RepositoryContext.Provider value={{transactionRepo, accountRepo}}>
			{children}
		</RepositoryContext.Provider>
	);
};

const RepositoryContext = createContext<{
	transactionRepo: DataModelRepository<Transaction>;
	accountRepo: DataModelRepository<Account>;
} | null>(null);

export const useRepository = (): {
	transactionRepo: DataModelRepository<Transaction>;
	accountRepo: DataModelRepository<Account>;
} => {
	const context = useContext(RepositoryContext);
	if (!context) {
		throw new Error("useRepository must be used within a RepositoryProvider");
	}
	return context;
};

export default RepositoryProvider;
