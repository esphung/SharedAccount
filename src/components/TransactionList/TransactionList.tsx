import CreditBuilder from "@builders/CreditBuilder";
import ExpenseBuilder from "@builders/ExpenseBuilder";
import UserBuilder from "@builders/UserBuilder";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { DateTime } from "luxon";
import React from "react";
import { Image, SectionList, StyleSheet, View } from "react-native";
import type { Credit } from "types/Credit";
import type { Expense } from "types/Expense";
import type { User } from "types/User";

// Sample Data
const users: User[] = [
  new UserBuilder().build(),
  new UserBuilder().setEmail("bob@gmail.com").build(),
];

const expenses: Expense[] = [
  new ExpenseBuilder()
    .setUserId(users[0].id)
    .setDate(DateTime.fromFormat("2025-03-18", "yyyy-MM-dd").toJSDate())
    .build(),
  new ExpenseBuilder()
    .setUserId(users[0].id)
    .setDate(DateTime.fromFormat("2025-03-22", "yyyy-MM-dd").toJSDate())
    .build(),

  new ExpenseBuilder()
    .setUserId(users[1].id)
    .setDate(DateTime.fromFormat("2025-03-01", "yyyy-MM-dd").toJSDate())
    .build(),
  new ExpenseBuilder()
    .setUserId(users[1].id)
    .setDate(DateTime.fromFormat("2025-03-19", "yyyy-MM-dd").toJSDate())
    .build(),
];

const credits: Credit[] = [
  new CreditBuilder()
    .setUserId(users[0].id)
    .setDate(DateTime.fromFormat("2025-03-01", "yyyy-MM-dd").toJSDate())
    .build(),
  new CreditBuilder()
    .setUserId(users[1].id)
    .setDate(DateTime.fromFormat("2025-03-19", "yyyy-MM-dd").toJSDate())
    .build(),
  new CreditBuilder()
    .setUserId(users[0].id)
    .setDate(DateTime.fromFormat("2025-03-19", "yyyy-MM-dd").toJSDate())
    .build(),
  new CreditBuilder()
    .setUserId(users[0].id)
    .setDate(DateTime.fromFormat("2025-03-22", "yyyy-MM-dd").toJSDate())
    .build(),
];

// Utility Functions
const getUserById = (userId: string) =>
  users.find((user) => user.id === userId);
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

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

// Main Component
const TransactionList = () => {
  const sections = groupTransactionsByDate(expenses, credits);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const user = getUserById(item.userId);
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
              <SharedAccountText style={styles.userName}>
                {user?.name}
              </SharedAccountText>
              <SharedAccountText style={styles.transactionText}>
                {item.type === "credit"
                  ? `+ ${formatCurrency(item.amount)} (from ${item.source})`
                  : `- ${formatCurrency(item.amount)} (${item.category})`}
              </SharedAccountText>
            </View>
            {/* Text-based Indicator for Expense or Credit */}
            <SharedAccountText
              style={[
                styles.transactionType,
                item.type === "credit" ? styles.credit : styles.expense,
              ]}
            >
              {item.type === "credit" ? "↑" : "↓"}
            </SharedAccountText>
          </View>
        );
      }}
      renderSectionHeader={({ section: { title } }) => (
        <SharedAccountText style={styles.header}>{title}</SharedAccountText>
      )}
      stickySectionHeadersEnabled={false}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 5,
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
  userName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  transactionText: {
    fontSize: 16,
  },
  transactionType: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  credit: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});

export default TransactionList;
