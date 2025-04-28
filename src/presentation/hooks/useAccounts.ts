import type { Account } from "@data/models/types/Account";
import useRepository from "@domain/contexts/useRepository";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { useCallback, useState } from "react";
import type { Transaction } from "types/Transaction";

// TODO: remove this fake user ID for testing
const FAKE_USER_ID = "usr_TEST_USER_ID" as `usr_${string}`;

export const mergeAccounts = (previous: Account[], updates: Account[]): Account[] => {
  const updatedState = previous.map((account) => {
    const updatedAccount = updates.find((updated) => updated.id === account.id);
    if (updatedAccount) {
      return {
        ...account,
        ...updatedAccount,
        transactions: updatedAccount.transactions.map((updatedTransaction) => {
          const existingTransaction = account.transactions.find(
            (transaction) => transaction.id === updatedTransaction.id,
          );
          if (existingTransaction) {
            return { ...existingTransaction, ...updatedTransaction };
          }
          return updatedTransaction;
        }),
      };
    }
    return account;
  });
  return updatedState;
};

const useAccounts = (): ReturnType<UseDataSource<Account>> & {
  currentAccount: Account | undefined;
  addTransaction: (
    input: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">,
    accountId: Account["id"],
  ) => Promise<void>;
  deleteTransaction: (txnId: Transaction["id"], accountId: Account["id"]) => Promise<void>;
} => {
  // Get the item repository
  const { accountRepo, transactionRepo } = useRepository();

  // Local state for items (ie: multiple accounts)
  const [state, setState] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account>();

  // Memoize the current account to avoid unnecessary re-renders
  const fetchItems = useCallback(async () => {
    const [allTransactions, allAccounts] = await Promise.all([transactionRepo.getAll(), accountRepo.getAll()]);

    // Set the transactions for each account
    const newState = allAccounts.map((account) => {
      const transactions = allTransactions.filter((transaction) => transaction.sharedAccountId === account.id);
      account.transactions = transactions;
      return account;
    });

    // Update the current account if it is not already set
    if (newState.length) {
      updateCurrentAccount(newState);
    }

    // Update the local state with the fetched accounts
    setState(newState);

    return allAccounts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount?.id]);

  // Delete a account
  const deleteItem = useCallback((id: string) => {
    setState((prevState) => prevState.filter((item) => item.id !== id));
    return accountRepo.delete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a account
  const addItem = useCallback(
    (params: Partial<Account>) => {
      const { name = "", startingBalance = 0, transactions = [] } = params;
      const acctId = params.id || `acct_${new Date().getTime()}`;
      const newAccount: Account = {
        id: acctId,
        startingBalance,
        transactions,
        name,
      };
      setState((prevState) => [...prevState, newAccount]);
      return accountRepo.add(newAccount);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const updateCurrentAccount = useCallback(
    (list: Account[]) => {
      const newCurrentAcct = list.find((acct) => acct.id === currentAccount?.id) || list[0];
      setCurrentAccount(newCurrentAcct); // pick first account by default
    },
    [currentAccount?.id],
  );

  // Start listening for live updates
  const startListening = useCallback(() => {
    const onUpdate = (updates: Account[]) => {
      setState((prevState) => {
        const merged = mergeAccounts(prevState, updates);
        updateCurrentAccount(merged);
        return merged;
      });
    };

    // Subscribe to live updates
    accountRepo.getLiveData(onUpdate);

    return () => {
      // Unsubscribe when component unmounts
      accountRepo.stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount?.id]);

  // Delete a transaction from the current account
  const deleteTransaction = useCallback(
    async (txnId: Transaction["id"], accountId: Account["id"]) => {
      if (!accountId) {
        throw new Error("[useAccounts:deleteTransaction] Account ID is required");
      }
      // Update the account in the repository
      const account = await accountRepo.getById(accountId);
      if (!account) {
        throw new Error("[useAccounts:addTransaction] Account not found");
      }
      account.transactions = account.transactions.filter((transaction) => transaction.id !== txnId);

      const txn = await transactionRepo.getById(txnId);
      if (!txn) {
        throw new Error("[useAccounts:deleteTransaction] Transaction not found");
      }

      // Update the account in the repository
      await accountRepo
        .update(account)
        .catch((error) => console.warn("[useAccounts:deleteTransaction] Error updating account:", error));

      // Delete the transaction from the repository
      await transactionRepo
        .delete(txn.id)
        .catch((error) => console.warn("[useAccounts:deleteTransaction] Error deleting transaction:", error));

      // Update the local state
      setState((prevState) => {
        const updatedState = prevState.map((acct) => {
          if (acct.id === accountId) {
            return {
              ...acct,
              transactions: acct.transactions.filter((transaction) => transaction.id !== txnId),
            };
          }
          return acct;
        });
        updateCurrentAccount(updatedState);
        return updatedState;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const addTransaction = useCallback(
    async (
      input: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">,
      accountId: Account["id"],
    ) => {
      const {
        id = `txn_${new Date().getTime()}`,
        userId,
        amount = 0,
        category = "",
        date = new Date(),
        type = "expense",
        name = "",
        description,
      } = input;
      // Create the transaction params
      const txnParams: Transaction = {
        id: id || `txn_${new Date().getTime()}`,
        amount,
        name,
        description,
        category,
        date,
        sharedAccountId: accountId,
        userId: userId || FAKE_USER_ID,
        type,
      };
      // Add the transaction to the repository
      await transactionRepo
        .add(txnParams)
        .catch((error) => console.warn("[useAccounts:addTransaction] Error adding transaction:", error));

      // Update the account in the repository
      const account = await accountRepo.getById(accountId);
      if (!account) {
        throw new Error("[useAccounts:addTransaction] Account not found");
      }
      await accountRepo
        .update({
          ...account,
          transactions: [...(account?.transactions || []), txnParams],
        })
        .catch((error) => console.warn("[useAccounts:addTransaction] Error updating account:", error));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Return the accounts and functions to interact with them
  return {
    state,
    fetchItems,
    deleteItem,
    addItem,
    startListening,
    currentAccount,
    addTransaction,
    deleteTransaction,
  };
};

export default useAccounts;
