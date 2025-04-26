import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button } from "react-native";
import type { SectionList } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import FullscreenSpinner from "@components/FullScreenSpinner/FullScreenSpinner";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";

import useTransactions from "@presentation/hooks/useTransactions";
import { DateTime } from "luxon";

import type { AppTabsParamList, AppTabsScreens } from "@presentation/navigators/AppTabs/AppTabs";
import type { Transaction } from "types/Transaction";

type ScreenProps = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Expenses>;

export const groupTransactionsByDate = (expenses: Transaction<"expense">[], credits: Transaction<"credit">[]) => {
  const transactions = [...expenses, ...credits];
  const grouped: Record<string, Transaction[]> = {};

  transactions.forEach((transaction) => {
    const dateKey = new Date(transaction.date).toDateString();
    grouped[dateKey] = grouped[dateKey] || [];
    grouped[dateKey].push(transaction);
  });

  return Object.entries(grouped)
    .map(([title, data]) => ({
      title,
      data: data.sort((a, b) => DateTime.fromJSDate(b.date).toMillis() - DateTime.fromJSDate(a.date).toMillis()),
    }))
    .sort(
      (a, b) => DateTime.fromJSDate(new Date(a.title)).toMillis() - DateTime.fromJSDate(new Date(b.title)).toMillis(),
    );
};

export default function ExpensesScreen({ navigation }: ScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isListReady, setIsListReady] = useState(false);
  const listRef = useRef<SectionList<Transaction>>(null);

  const {
    state: transactions,
    fetchItems: fetchTransactions,
    startListening,
    addItem: addTransaction,
    deleteItem: deleteTransaction,
  } = useTransactions();

  const handleAddExpense = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleSubmitExpense = useCallback(async (data: { amount: number; category: string; date: Date }) => {
    try {
      await addTransaction(data);
      await fetchTransactions();
      setModalVisible(false);
      scrollToTop();
    } catch (error) {
      console.error("[ExpensesScreen] Error adding transaction:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransactionPress = useCallback((id: string) => {
    Alert.alert("Delete Transaction", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTransaction(id).then(fetchTransactions),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionsData = useMemo(() => {
    const expenses = transactions.filter(
      (transaction): transaction is Transaction<"expense"> => transaction.type === "expense",
    );
    const credits = transactions.filter(
      (transaction): transaction is Transaction<"credit"> => transaction.type === "credit",
    );
    return groupTransactionsByDate(expenses, credits);
  }, [transactions]);

  const scrollToTop = useCallback(() => {
    if (sectionsData.length && listRef.current) {
      listRef.current.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        animated: true,
        viewPosition: 0,
        viewOffset: 0,
      });
    }
  }, [sectionsData]);

  useEffect(() => {
    const unsubscribe = startListening();
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsListReady(false);
      fetchTransactions().then(() => {
        setIsListReady(true);
        scrollToTop();
      });
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToTop]);

  return (
    <SharedAccountScreen>
      <Button title="Add an expense" onPress={handleAddExpense} />
      <TransactionList
        ref={listRef}
        data={sectionsData}
        onPress={handleTransactionPress}
        onContentSizeChange={scrollToTop}
        isListReady={isListReady}
      />
      <AddExpenseSheet
        listRef={listRef}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={handleSubmitExpense}
      />
      <FullscreenSpinner visible={!isListReady} />
    </SharedAccountScreen>
  );
}
