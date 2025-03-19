import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import RepositoryFactory from "@repositories/RepositoryFactory";
import React, { useState } from "react";
import { Alert } from "react-native";
import type { Transaction } from "types/Transaction";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Expenses>;

// TODO: Move to context
const transactionRepo = RepositoryFactory.createTransactionRepository();

export default function ExpensesScreen(_: Props) {
  // state
  const [modalVisible, setModalVisible] = useState(false);

  // TODO: Move to context
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // TODO: Move to context
  async function fetchTransactions() {
    const txns = await transactionRepo.getTransactions();
    console.debug("[ExpensesScreen] Transactions:", txns);
    setTransactions(txns);
  }

  // TODO: Move to context
  async function addTransaction({
    amount,
    category,
    date,
  }: {
    amount: number;
    category: string;
    date: Date;
  }) {
    // Alert.alert("Adding transaction...");
    transactionRepo
      .addTransaction({
        id: `txn_${new Date().getTime()}`,
        userId: `usr_${new Date().getTime()}`,
        amount,
        description: "Test",
        name: "Test",
        category,
        date,
        sharedAccountId: `acct_${new Date().getTime()}`,
        type: "expense",
      })
      .then((result) => {
        console.debug("[ExpensesScreen] addTransaction result:", result);
      });
  }

  const onSubmit = React.useCallback(
    (data: { amount: number; category: string; date: Date }) => {
      addTransaction(data).then(() => {
        fetchTransactions();
        setModalVisible(false);
      });
    },

    [],
  );

  const onShowAddTxnSheet = React.useCallback(() => {
    setModalVisible(true);
  }, []);

  React.useEffect(() => {
    fetchTransactions().then((result) => {
      console.debug("[ExpensesScreen] fetchTransactions result:", result);
    });
  }, []);

  return (
    <SharedAccountScreen>
      <TransactionList
        users={[]}
        transactions={transactions}
        onShowAddTxnSheet={onShowAddTxnSheet}
        onPress={(id) => {
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
                await transactionRepo.deleteTransaction(id);
                fetchTransactions();
              },
            },
          ]);
        }}
      />
      <AddExpenseSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={onSubmit}
      />
    </SharedAccountScreen>
  );
}
