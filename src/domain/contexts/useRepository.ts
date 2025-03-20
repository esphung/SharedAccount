import { createContext, useContext } from "react";
import type { TransactionRepository } from "types/TransactionRepository";

export const RepositoryContext = createContext<{
  transactionRepo: TransactionRepository;
} | null>(null);

const useRepository = (): {
  transactionRepo: TransactionRepository;
} => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};

export default useRepository;
