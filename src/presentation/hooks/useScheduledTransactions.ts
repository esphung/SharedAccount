import useRepository from "@domain/contexts/useRepository";
import { useCallback, useState } from "react";
import type { ScheduledTransaction } from "types/ScheduledTransaction";
import type { UseDataSource } from "types/UseDataSource";

const useScheduledTransactions: UseDataSource<ScheduledTransaction> = () => {
  // Get the item repository
  const { scheduledTransactionRepo } = useRepository();

  // Local state for items
  const [state, setState] = useState<ScheduledTransaction[]>([]);

  // Fetch transactions from the repository
  const fetchItems = useCallback(async () => {
    const InputModeOptions = await scheduledTransactionRepo.getAll();
    setState(InputModeOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start listening for live updates
  const startListening = useCallback(() => {
    // Subscribe to live updates
    scheduledTransactionRepo.getLiveData(setState);
    return () => {
      // Unsubscribe when component unmounts
      scheduledTransactionRepo.stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete a transaction
  const deleteItem = useCallback((id: string) => {
    return scheduledTransactionRepo.delete(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a transaction
  const addItem = useCallback(
    (params: Partial<ScheduledTransaction>) => {
      const id: `schd_${string}` = `schd_${Math.random().toString(36).substr(2, 9)}`;
      return scheduledTransactionRepo.add({
        ...params,
        id: params.id || id,
      } as ScheduledTransaction);
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

export default useScheduledTransactions;
