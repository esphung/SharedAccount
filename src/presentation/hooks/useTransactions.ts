import type { Transaction } from "@data/models/types/Transaction";
import useRepository from "@domain/contexts/useRepository";
import type { UseDataSource } from "@presentation/types/UseDataSource";
import { useCallback, useState } from "react";

const useTransactions: UseDataSource<Transaction> = () => {
  // Get the item repository
  const { transactionRepo } = useRepository();

  // Local state for items
  const [state, setState] = useState<Transaction[]>([]);

  // Fetch transactions from the repository
  const fetchItems = useCallback(async () => {
    const fetchedItems = await transactionRepo.getAll();
    setState(fetchedItems);
    return fetchedItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start listening for live updates
  const startListening = useCallback(() => {
    // Subscribe to live updates
    transactionRepo.getLiveData(setState);
    return () => {
      // Unsubscribe when component unmounts
      transactionRepo.stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete a transaction
  const deleteItem = useCallback((id: string) => {
    return transactionRepo.delete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a transaction
  const addItem = useCallback(
    (params: Partial<Transaction>) => {
      const { amount = 0, category = "", date = new Date(), type = "expense" } = params;
      return transactionRepo.add({
        id: `txn_${new Date().getTime()}`,
        userId: `usr_${new Date().getTime()}`,
        amount,
        description: "Test",
        name: "Test",
        category,
        date,
        sharedAccountId: `acct_${new Date().getTime()}`,
        type,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Return the transactions and functions to interact with them
  return {
    state,
    fetchItems,
    startListening,
    deleteItem,
    addItem,
  };
};

export default useTransactions;
