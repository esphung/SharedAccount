import RepositoryFactory from "@repositories/RepositoryFactory";
import React, { createContext, useContext } from "react";
import type { TransactionRepository } from "types/TransactionRepository";

const RepositoryContext = createContext<{
  transactionRepo: TransactionRepository;
} | null>(null);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const transactionRepo = RepositoryFactory.createTransactionRepository();

  return (
    <RepositoryContext.Provider value={{ transactionRepo }}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepository = (): {
  transactionRepo: TransactionRepository;
} => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};
