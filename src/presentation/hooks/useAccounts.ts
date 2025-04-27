import type { Account } from "@data/models/types/Account";
import useRepository from "@domain/contexts/useRepository";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import MoneyFunctions from "@utils/MoneyFunctions";
import { useCallback, useMemo, useState } from "react";

const initialAccount: Partial<Account> = {
  name: "Initial Account",
  startingBalance: 0,
  transactions: [],
};

const useAccounts = (): ReturnType<UseDataSource<Account>> & {
  getTotalBalance: (transactions: { type: "expense" | "credit"; amount: number }[]) => string;
} => {
  // Get the item repository
  const { accountRepo } = useRepository();

  // Local state for items (ie: multiple accounts)
  const [state, setState] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccountId] = useState<Account>();

  const currentAccountId = useMemo(() => {
    if (!currentAccount) {
      return initialAccount.id;
    }
    return currentAccount.id;
  }, [currentAccount]);

  const fetchItems = useCallback(async () => {
    const fetchedItems = await accountRepo.getAll();
    setState(fetchedItems);

    // if no current account is set, pick the first one
    if (fetchedItems.length) {
      const newCurrentAcct = fetchedItems.find((acct) => acct.id === currentAccountId) || fetchedItems[0];
      setCurrentAccountId(newCurrentAcct); // pick first account by default
    }

    return fetchedItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccountId]);

  // Delete a account
  const deleteItem = useCallback((id: string) => {
    return accountRepo.delete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a account
  const addItem = useCallback(
    (params: Partial<Account>) => {
      // const { amount = 0, category = "", date = new Date(), type = "expense" } = params;
      const { name = "", startingBalance = 0, transactions = [], id } = params;
      return accountRepo.add({
        id: id || `acct_${new Date().getTime()}`,
        startingBalance,
        transactions,
        name,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Start listening for live updates
  const startListening = useCallback(() => {
    // Subscribe to live updates
    accountRepo.getLiveData(setState);

    return () => {
      // Unsubscribe when component unmounts
      accountRepo.stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTotalBalance = useCallback(
    (transactions: { type: "expense" | "credit"; amount: number }[]) => {
      // current starting balance
      const total = 0;

      // reduce all transactions to get the total balance
      const transactionsTotal = transactions.reduce((acc, transaction) => {
        if (transaction.type === "expense") {
          return acc - transaction.amount;
        }
        return acc + transaction.amount;
      }, total);

      // get the current account balance
      const currentAccountBalance = state.find((account) => account.id === currentAccount?.id)?.startingBalance || 0;

      // get the total balance in cents
      const centsTotalBalance = currentAccountBalance + transactionsTotal;
      return MoneyFunctions.formatMoney(centsTotalBalance);
    },
    [currentAccount?.id, state],
  );

  // Return the accounts and functions to interact with them
  return {
    state,
    fetchItems,
    deleteItem,
    addItem,
    startListening,
    getTotalBalance,
  };
};

export default useAccounts;
