import type { Transaction } from "@data/models/types/Transaction";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import { createContext, useContext } from "react";
import type { Account } from "types/Account";

export const RepositoryContext = createContext<{
  transactionRepo: DataModelRepository<Transaction>;
  accountRepo: DataModelRepository<Account>;
} | null>(null);

const useRepository = (): {
  transactionRepo: DataModelRepository<Transaction>;
  accountRepo: DataModelRepository<Account>;
} => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};

export default useRepository;
