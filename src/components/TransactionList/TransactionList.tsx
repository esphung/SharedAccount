import TransactionListFooter from "@components/TransactionList/TransactionListFooter";
import TransactionListHeader from "@components/TransactionList/TransactionListHeader";
import TransactionListItem from "@components/TransactionList/TransactionListItem";
import { DateTime } from "luxon";
import React from "react";
import { SectionList } from "react-native";
import type { Credit } from "types/Credit";
import type { Expense } from "types/Expense";
import type { User } from "types/User";

// Utility Functions
const getUserById = (userId: string, users: User[] = []) =>
  users.find((user) => user.id === userId);

// Group Transactions by Date
const groupTransactionsByDate = (
  expensesArray: Expense[],
  creditsArray: Credit[],
) => {
  const transactions = [...expensesArray, ...creditsArray];
  const grouped: { title: string; data: (Expense | Credit)[] }[] = [];
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toDateString();
    const existingGroup = grouped.find((group) => group.title === date);
    if (existingGroup) {
      existingGroup.data.push(transaction);
    } else {
      grouped.push({ title: date, data: [transaction] });
    }
  });
  // Sort by Date
  grouped.sort((a, b) => {
    return (
      DateTime.fromFormat(b.title, "EEE MMM dd yyyy").toJSDate().getTime() -
      DateTime.fromFormat(a.title, "EEE MMM dd yyyy").toJSDate().getTime()
    );
  });
  return grouped;
};

// Props
type TransactionListProps = {
  transactions: (Credit | Expense)[];
  users: User[];
};

// Main Component
const TransactionList = (props: TransactionListProps) => {
  const { transactions, users } = props;
  const expenses = transactions.filter(
    (transaction): transaction is Expense => transaction.type === "expense",
  );
  const credits = transactions.filter(
    (transaction): transaction is Credit => transaction.type === "credit",
  );

  const sections = React.useMemo(
    () => groupTransactionsByDate(expenses, credits),
    [expenses, credits],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const user = getUserById(item.userId, users);
        return <TransactionListItem item={item} user={user} />;
      }}
      renderSectionHeader={({ section: { title } }) => (
        <TransactionListHeader title={title} type="listSectionHeader" />
      )}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <TransactionListHeader title="Recent Transactions" type="listHeader" />
      }
      ListFooterComponent={TransactionListFooter}
    />
  );
};

export default TransactionList;
