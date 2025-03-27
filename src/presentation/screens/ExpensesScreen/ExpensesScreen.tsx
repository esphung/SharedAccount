import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import useTransactions from "@presentation/hooks/useTransactions";
import React, { useState } from "react";
import { Alert, Button } from "react-native";

export default function ExpensesScreen() {
  // state
  const [modalVisible, setModalVisible] = useState(false);

  // hooks
  const {
    state: transactions,
    fetchItems: fetchTransactions,
    startListening,
    addItem: addTransaction,
    deleteItem: deleteTransaction,
  } = useTransactions();

  // effects
  React.useEffect(() => {
    const sub = startListening();
    return () => {
      sub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = React.useCallback(
    (data: { amount: number; category: string; date: Date }) => {
      addTransaction(data).then(() => {
        fetchTransactions();
        setModalVisible(false);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onShowAddTxnSheet = React.useCallback(() => {
    setModalVisible(true);
  }, []);

  return (
    <SharedAccountScreen>
      <Button title="Add an expense" onPress={onShowAddTxnSheet} />
      <TransactionList
        users={[]}
        transactions={transactions}
        onShowAddTxnSheet={onShowAddTxnSheet}
        onPress={(id: string) => {
          console.debug("[ExpensesScreen] Transaction ID:", id);
          Alert.alert("Delete Transaction", "Are you sure?", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                console.debug("[ExpensesScreen] Deleting transaction:", id);
                await deleteTransaction(id);
                fetchTransactions();
              },
            },
          ]);
        }}
      />
      <AddExpenseSheet modalVisible={modalVisible} setModalVisible={setModalVisible} onSubmit={onSubmit} />
    </SharedAccountScreen>
  );
}
