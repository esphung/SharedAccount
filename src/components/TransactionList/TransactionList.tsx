import TransactionListFooter from "@components/TransactionList/TransactionListFooter";
import TransactionListHeader from "@components/TransactionList/TransactionListHeader";
import TransactionListItem from "@components/TransactionList/TransactionListItem";
import { DateTime } from "luxon";
import React from "react";
import { SectionList } from "react-native";
import type { Transaction } from "types/Transaction";
import type { User } from "types/User";

// Utility Functions
const getUserById = (userId: string, users: User[] = []) =>
  users.find((user) => user.id === userId);

// Group Transactions by Date
const groupTransactionsByDate = (
  expensesArray: Transaction<"expense">[],
  creditsArray: Transaction<"credit">[],
) => {
  const transactions = [...expensesArray, ...creditsArray];
  const grouped: { title: string; data: Transaction[] }[] = [];
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toDateString();
    const existingGroup = grouped.find((group) => group.title === date);
    if (existingGroup) {
      existingGroup.data.push(transaction);
    } else {
      grouped.push({ title: date, data: [transaction] });
    }
  });

  const sorted = grouped.map((group) => {
    const sortedData = group.data.sort((a, b) => {
      return (
        DateTime.fromJSDate(a.date).toMillis() -
        DateTime.fromJSDate(b.date).toMillis()
      );
    });
    // group.data = sortedData;
    return { title: group.title, data: sortedData };
  });

  return sorted;
};

// Props
type Props = {
  transactions: Transaction[];
  users: User[];
  onShowAddTxnSheet: () => void;
  onPress: (id: string) => void;
};

// Main Component
const TransactionList = (props: Props) => {
  const { transactions = [], users = [], onShowAddTxnSheet, onPress } = props;

  const sections = React.useMemo(
    () =>
      groupTransactionsByDate(
        transactions.filter(
          (transaction: {
            type: "expense" | "credit";
          }): transaction is Transaction<"expense"> =>
            transaction.type === "expense",
        ),
        transactions.filter(
          (transaction: {
            type: "expense" | "credit";
          }): transaction is Transaction<"credit"> =>
            transaction.type === "credit",
        ),
      ),
    [transactions],
  );

  const renderListFooter = React.useCallback(
    () => <TransactionListFooter onPress={onShowAddTxnSheet} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const user = getUserById(item.userId, users);
        return (
          <TransactionListItem item={item} user={user} onPress={onPress} />
        );
      }}
      renderSectionHeader={({ section: { title } }) => (
        <TransactionListHeader title={title} />
      )}
      stickySectionHeadersEnabled={false}
      ListFooterComponent={renderListFooter}
    />
  );
};

export default TransactionList;
