import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import FullscreenSpinner from "@components/FullScreenSpinner/FullScreenSpinner";
import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import useTransactions from "@presentation/hooks/useTransactions";
import type { AppTabsParamList, AppTabsScreens } from "@presentation/navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DateTime } from "luxon";
import type { RefObject } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SectionList } from "react-native";
import { Alert, Button } from "react-native";
import type { Transaction } from "types/Transaction";

type ScreenProps = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Expenses>;

export const groupTransactionsByDate = (
  expenses: Transaction<"expense" | "credit">[],
  credits: Transaction<"expense" | "credit">[],
) => {
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
      (a, b) => DateTime.fromJSDate(new Date(b.title)).toMillis() - DateTime.fromJSDate(new Date(a.title)).toMillis(),
    );
};

export const showAsyncAlertPrompt = (onDelete: () => void) => {
  Alert.alert("Delete Transaction", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: onDelete,
    },
  ]);
};

export const scrollToTop = (
  data: { title: string; data: Transaction[] }[],
  ref: RefObject<SectionList<Transaction> | null>,
) => {
  if (!!data && data?.length && ref?.current) {
    ref.current.scrollToLocation({
      itemIndex: 0,
      sectionIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 0,
    });
  }
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

  const sectionsData = useMemo(() => {
    const expenses = transactions.filter(
      (transaction): transaction is Transaction<"expense"> => transaction.type === "expense",
    );
    const credits = transactions.filter(
      (transaction): transaction is Transaction<"credit"> => transaction.type === "credit",
    );
    return groupTransactionsByDate(expenses, credits);
  }, [transactions]);

  useEffect(() => {
    const unsubscribe = startListening();
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFocus = async () => {
      setIsListReady(false);
      await fetchTransactions().catch((error) => {
        console.warn("[ExpensesScreen] Error fetching transactions:", error);
      });
      setIsListReady(true);
      scrollToTop(sectionsData, listRef);
    };
    const unsubscribe = navigation.addListener("focus", onFocus);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsData]);

  return (
    <SharedAccountScreen>
      <ScreenTitle title="Expenses" />
      <Button title="Add an expense" onPress={handleAddExpense} />
      <TransactionList
        ref={listRef}
        data={sectionsData}
        onPress={(id) => showAsyncAlertPrompt(() => deleteTransaction(id).then(fetchTransactions))}
        onContentSizeChange={() => scrollToTop(sectionsData, listRef)}
        isListReady={isListReady}
      />
      <AddExpenseSheet
        listRef={listRef}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={async (data: { amount: number; category: string; date: Date }) => {
          try {
            await addTransaction(data);
            await fetchTransactions();
            setModalVisible(false);
            scrollToTop(sectionsData, listRef);
          } catch (error) {
            console.error("[ExpensesScreen] Error adding transaction:", error);
          }
        }}
      />
      <FullscreenSpinner visible={!isListReady} />
    </SharedAccountScreen>
  );
}
