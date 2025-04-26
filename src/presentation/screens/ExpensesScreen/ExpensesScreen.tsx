import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import useTransactions from "@presentation/hooks/useTransactions";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button } from "react-native";

export default function ExpensesScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    state: transactions,
    fetchItems: fetchTransactions,
    startListening,
    addItem: addTransaction,
    deleteItem: deleteTransaction,
  } = useTransactions();

  useEffect(() => {
    const unsubscribe = startListening();
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddExpense = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleSubmitExpense = useCallback(
    (data: { amount: number; category: string; date: Date }) => {
      addTransaction(data).then(() => {
        fetchTransactions();
        setModalVisible(false);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleTransactionPress = useCallback(
    (id: string) => {
      Alert.alert("Delete Transaction", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id).then(fetchTransactions),
        },
      ]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <SharedAccountScreen>
      <Button title="Add an expense" onPress={handleAddExpense} />
      <TransactionList transactions={transactions} onPress={handleTransactionPress} />
      <AddExpenseSheet modalVisible={modalVisible} setModalVisible={setModalVisible} onSubmit={handleSubmitExpense} />
    </SharedAccountScreen>
  );
}
