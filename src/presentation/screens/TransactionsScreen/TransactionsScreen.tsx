import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import { isCreditTransaction, isExpenseTransaction } from "@data/validation/Transaction";
import useAccounts from "@hooks/useAccounts";
import type { AppTabsParamList, AppTabsScreens } from "@presentation/navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import MoneyFunctions from "@utils/MoneyFunctions";
import { DateTime } from "luxon";
import type { RefObject } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AlertButton, SectionList } from "react-native";
import { Alert, Button } from "react-native";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

type ScreenProps = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Transactions>;

export const calculateTotal = (account: Account) => {
  // current starting balance
  const total = 0;

  // reduce all transactions to get the total balance
  const transactionsTotal = [...(account?.transactions || [])].reduce((acc, transaction) => {
    if (isExpenseTransaction(transaction)) {
      return acc - transaction.amount;
    }
    if (isCreditTransaction(transaction)) {
      return acc + transaction.amount;
    }
    // if the transaction type is not expense or credit, return the current accumulator
    return acc;
  }, total);

  // get the current account balance
  const currentAccountBalance = account?.startingBalance || 0;

  // get the total balance in cents
  const centsTotalBalance = currentAccountBalance + (transactionsTotal || 0);

  // return the total balance in dollars as a formatted string
  return MoneyFunctions.formatMoney(centsTotalBalance, 2);
};

export const groupTransactionsByDate = (expenses: Transaction[], credits: Transaction[]) => {
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

export default function TransactionsScreen({ navigation }: ScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isListReady, setIsListReady] = useState(false);
  const listRef = useRef<SectionList<Transaction>>(null);

  const {
    fetchItems: fetchAccounts,
    startListening: startAccountsListening,
    addItem: addAccount,
    currentAccount,
    currentAccount: { transactions = [] } = {},
    addTransaction,
    deleteTransaction,
  } = useAccounts();

  const sectionsData = useMemo(() => {
    const expenses = transactions.filter(isExpenseTransaction);
    const credits = transactions.filter(isCreditTransaction);
    return groupTransactionsByDate(expenses, credits);
  }, [transactions]);

  useEffect(() => {
    const unsubscribeAccounts = startAccountsListening();
    return () => {
      unsubscribeAccounts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFocus = async () => {
      setIsListReady(false);
      try {
        const fetchedAccounts = await fetchAccounts();
        // ✅ Check fresh data, NOT stale state
        if (fetchedAccounts.length === 0) {
          promptToCreateAccount();
        }
      } catch (error) {
        console.warn("[TransactionsScreen] Error fetching data:", error);
      }
      setIsListReady(true);
      scrollToTop(sectionsData, listRef);
    };

    const unsubscribeOnFocus = navigation.addListener("focus", onFocus);
    return unsubscribeOnFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsData]);

  const promptToCreateAccount = useCallback(() => {
    showAsyncAlertPrompt({
      title: "Create Account",
      message: "You don't have an account yet. Create one now to start tracking expenses!",
      cancelable: false,
    }).then((shouldCreate) => {
      if (shouldCreate) {
        addAccount({ startingBalance: 0 })
          .then(() => Alert.alert("Account created successfully"))
          .catch((error) => console.error("[TransactionsScreen] Error creating account:", error));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteTransaction = useCallback(
    (txnId: Transaction["id"]) =>
      showAsyncAlertPrompt({
        title: "Delete Transaction",
        message: "Are you sure you want to delete this transaction?",
        cancelable: true,
      }).then((shouldDelete) => {
        if (shouldDelete) {
          deleteTransaction(txnId, currentAccount?.id as `acct_${string}`)
            .then(() => Alert.alert("Transaction deleted successfully"))
            .catch((error) => console.error("[TransactionsScreen] Error deleting transaction:", error));
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAccount?.id],
  );

  const openExpenseSheet = useCallback(() => {
    setModalVisible(true);
  }, []);

  const screenTitleBalance = useMemo(() => {
    if (!currentAccount) {
      return "No account";
    }
    return `Balance: ${calculateTotal(currentAccount)}`;
  }, [currentAccount]);

  const handleCreateAccountTransaction = useCallback(
    // async (params: Partial<Transaction> & Omit<Transaction, "id" | "sharedAccountId" | "userId">) => {
    async (params: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => {
      if (!currentAccount?.id) {
        console.warn("[TransactionsScreen] No current account");
        return;
      }
      try {
        await addTransaction(params, currentAccount?.id)
          .then(() => {
            setModalVisible(false);
            scrollToTop(sectionsData, listRef);
          })
          .then(() => Alert.alert("Transaction added successfully"))
          .catch((error) => {
            console.error("[TransactionsScreen] Error adding transaction:", error);
            throw error;
          });
      } catch (error) {
        console.error("[TransactionsScreen] Error adding transaction:", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectionsData, currentAccount?.id],
  );

  return (
    <SharedAccountScreen>
      <ScreenTitle title="Transactions" subtitle={screenTitleBalance} />
      <Button title="Add an expense" onPress={openExpenseSheet} disabled={!isListReady} />
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
        onSubmit={handleCreateAccountTransaction}
      />
    </SharedAccountScreen>
  );
}
