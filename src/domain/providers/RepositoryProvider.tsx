import RepositoryFactory from "@data/repositories/RepositoryFactory";
import { RepositoryContext } from "@domain/contexts/useRepository";
import React from "react";

const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const transactionRepo = RepositoryFactory.createTransactionRepository();
  const scheduledTransactionRepo =
    RepositoryFactory.createScheduledTransactionRepository();

  return (
    <RepositoryContext.Provider
      value={{
        transactionRepo,
        scheduledTransactionRepo,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};

export default RepositoryProvider;

// export const useRepository = (): {
//   transactionRepo: TransactionRepository;
// } => {
//   const context = useContext(RepositoryContext);
//   if (!context) {
//     throw new Error("useRepository must be used within a RepositoryProvider");
//   }
//   return context;
// };
