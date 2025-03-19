import { useRepository } from "@providers/RepositoryProvider";
import { useCallback, useState } from "react";
import type { Transaction } from "types/Transaction";

const useTransactions = () => {
  // Get the transaction repository
  const { transactionRepo } = useRepository();

  // Local state for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch transactions from the repository
  const fetchTransactions = useCallback(async () => {
    const txns = await transactionRepo.getTransactions();
    setTransactions(txns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start listening for live updates
  const startListening = useCallback(() => {
    // Subscribe to live updates
    transactionRepo.getLiveTransactions(setTransactions);
    return () => {
      // Unsubscribe when component unmounts
      transactionRepo.stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return the transactions and functions to interact with them
  return {
    transactions,
    fetchTransactions,
    startListening,
    deleteTransaction: (id: string) => {
      return transactionRepo.deleteTransaction(id);
    },
    addTransaction: ({
      amount,
      category,
      date,
      type = "expense",
    }: {
      amount: number;
      category: string;
      date: Date;
      type?: "credit" | "expense";
    }) => {
      return transactionRepo.addTransaction({
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
  };
};

export default useTransactions;
