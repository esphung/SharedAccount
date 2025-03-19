import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { DateTime } from "luxon";
import React from "react";
import { Image, SectionList, StyleSheet, View } from "react-native";
import type { Credit } from "types/Credit";
import type { Expense } from "types/Expense";
import type { User } from "types/User";

// Utility Functions
const getUserById = (userId: string, users: User[] = []) =>
  users.find((user) => user.id === userId);
const formatCurrency = (amount: number) => {
  // convert cents to dollars
  return `$${(amount / 100).toFixed(2)}`;
};

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
  expenses?: Expense[];
  credits?: Credit[];
  users: User[];
};

// Main Component
const TransactionList = (props: TransactionListProps) => {
  const { expenses = [], credits = [], users = [] } = props;

  const sections = groupTransactionsByDate(expenses, credits);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const user = getUserById(item.userId, users);
        return (
          <View style={styles.item}>
            {/* User Avatar */}
            {user?.avatar && (
              <Image
                style={styles.avatar}
                source={{
                  uri: user.avatar,
                }}
              />
            )}
            {/* Transaction Info */}
            <View style={styles.transactionDetails}>
              <SharedAccountText type="listItemTitle">
                {user?.name}
              </SharedAccountText>
              <SharedAccountText type="listItemSubtitle">
                {item.type === "credit"
                  ? `+ ${formatCurrency(item.amount)} (from ${item.source})`
                  : `- ${formatCurrency(item.amount)} (${item.category})`}
              </SharedAccountText>
            </View>
            {/* Text-based Indicator for Expense or Credit */}
            <SharedAccountText
              type="transactionType"
              style={[item.type === "credit" ? styles.credit : styles.expense]}
            >
              {item.type === "credit" ? "↑" : "↓"}
            </SharedAccountText>
          </View>
        );
      }}
      renderSectionHeader={({ section: { title } }) => (
        <SharedAccountText type="listSectionHeader" style={styles.header}>
          {title}
        </SharedAccountText>
      )}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <SharedAccountText type="listHeader" style={styles.header}>
          Recent Transactions
        </SharedAccountText>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          <SharedAccountButton type="secondary" title="Add an expense" />
        </View>
      }
    />
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    padding: 8,
  },
  footer: {
    padding: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  credit: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});

export default TransactionList;
