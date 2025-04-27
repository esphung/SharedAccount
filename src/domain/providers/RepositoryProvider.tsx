import RepositoryFactory from "@data/repositories/RepositoryFactory";
import { RepositoryContext } from "@domain/contexts/useRepository";
import type { PropsWithChildren } from "react";
import React from "react";

type Props = PropsWithChildren<{
  // add props here
}>;

const RepositoryProvider: React.FC<Props> = ({ children }) => {
  const transactionRepo = RepositoryFactory.createTransactionRepository();
  const accountRepo = RepositoryFactory.createAccountRepository();
  return <RepositoryContext.Provider value={{ transactionRepo, accountRepo }}>{children}</RepositoryContext.Provider>;
};

export default RepositoryProvider;
