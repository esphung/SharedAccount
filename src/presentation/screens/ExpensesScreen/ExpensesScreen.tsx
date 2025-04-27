import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import useAccounts from "@hooks/useAccounts";
import useTransactions from "@presentation/hooks/useTransactions";
import type { AppTabsParamList, AppTabsScreens } from "@presentation/navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DateTime } from "luxon";
import type { RefObject } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AlertButton, SectionList } from "react-native";
import { Alert, Button } from "react-native";
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
      (a, b) => DateTime.fromJSDate(new Date(b.title)).toMillis() - DateTime.fromJSDate(new Date(a.title)).toMillis(),
    );
};

export const showAsyncAlertPrompt = ({
  title = "Delete Transaction",
  message = "Are you sure?",
  cancelable = true,
}: {
  title?: string;
  message?: string;
  cancelable?: boolean;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    const buttons: AlertButton[] = [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => resolve(false),
      },
      {
        text: "OK",
        style: "default",
        onPress: () => resolve(true),
      },
    ];
    if (!cancelable) {
      buttons.shift();
    }
    return Alert.alert(title, message, buttons);
  });
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
    startListening: startTransactionListening,
    addItem: addTransaction,
    deleteItem: deleteTransaction,
  } = useTransactions();

  const {
    state: accounts,
    fetchItems: fetchAccounts,
    startListening: startAccountsListening,
    addItem: addAccount,
    getTotalBalance,
  } = useAccounts();

  const totalBalance = useMemo(() => {
    return getTotalBalance(transactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

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
    const unsubscribeAccounts = startAccountsListening();
    const unsubscribeTransactions = startTransactionListening();

    return () => {
      unsubscribeAccounts();
      unsubscribeTransactions();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFocus = async () => {
      setIsListReady(false);

      try {
        const [fetchedAccounts, _fetchedTransactions] = await Promise.all([
          fetchAccounts(), // returns accounts
          fetchTransactions(),
        ]);

        // ✅ Check fresh data, NOT stale state
        if (fetchedAccounts.length === 0) {
          promptToCreateAccount();
        }
      } catch (error) {
        console.warn("[ExpensesScreen] Error fetching data:", error);
      }

      setIsListReady(true);
      scrollToTop(sectionsData, listRef);
    };

    const unsubscribeOnFocus = navigation.addListener("focus", onFocus);
    return unsubscribeOnFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsData, accounts.length]);

  const promptToCreateAccount = useCallback(() => {
    showAsyncAlertPrompt({
      title: "Create Account",
      message: "You don't have an account yet. Create one now to start tracking expenses!",
      cancelable: false,
    }).then((shouldCreate) => {
      if (shouldCreate) {
        addAccount({ name: "New Account", startingBalance: 0 })
          .then(() => fetchAccounts())
          .then(() => Alert.alert("Account created successfully"))
          .catch((error) => console.error("[ExpensesScreen] Error creating account:", error));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteTransaction = useCallback(
    (id: string) =>
      showAsyncAlertPrompt({
        title: "Delete Transaction",
        message: "Are you sure you want to delete this transaction?",
        cancelable: true,
      }).then((shouldDelete) => {
        if (shouldDelete) {
          deleteTransaction(id)
            .then(() => fetchTransactions())
            .then(() => Alert.alert("Transaction deleted successfully"))
            .catch((error) => console.error("[ExpensesScreen] Error deleting transaction:", error));
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleAddExpense = useCallback(() => {
    setModalVisible(true);
  }, []);

  const screenTitleBalance = useMemo(() => {
    if (!isListReady) {
      return "Loading...";
    }
    if (!accounts?.length) {
      return "No account";
    }
    return `Balance: ${totalBalance}`;
  }, [accounts?.length, isListReady, totalBalance]);

  return (
    <SharedAccountScreen>
      <ScreenTitle title="Expenses" subtitle={screenTitleBalance} />
      <Button title="Add an expense" onPress={handleAddExpense} disabled={!isListReady} />
      <TransactionList
        ref={listRef}
        data={sectionsData}
        onPress={handleDeleteTransaction}
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
    </SharedAccountScreen>
  );
}
