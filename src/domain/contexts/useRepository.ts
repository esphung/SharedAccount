import { createContext, useContext } from "react";
import type { DataModelRepository } from "types/DataModelRepository";
import type { ScheduledTransaction } from "types/ScheduledTransaction";
import type { Transaction } from "types/Transaction";

export const RepositoryContext = createContext<{
  transactionRepo: DataModelRepository<Transaction>;
  scheduledTransactionRepo: DataModelRepository<ScheduledTransaction>;
} | null>(null);

const useRepository = (): {
  transactionRepo: DataModelRepository<Transaction>;
  scheduledTransactionRepo: DataModelRepository<ScheduledTransaction>;
} => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};

export default useRepository;
