import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@themes/colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import type { Credit } from "types/Credit";
import type { Expense } from "types/Expense";
import type { User } from "types/User";

const formatCurrency = (amount: number) => {
  // convert cents to dollars
  return `$${(amount / 100).toFixed(2)}`;
};

export default function TransactionListItem({
  item,
  user,
}: {
  item: Expense | Credit;
  user?: User;
}) {
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
        <SharedAccountText type="listItemTitle">{user?.name}</SharedAccountText>
        <SharedAccountText type="listItemSubtitle">
          {item.type === "credit"
            ? `+ ${formatCurrency(item.amount)} (from ${item.source})`
            : `- ${formatCurrency(item.amount)} (${item.category})`}
        </SharedAccountText>
      </View>
      {/* Text-based Indicator for Expense or Credit */}
      <SharedAccountText
        type="transactionType"
        style={item.type === "credit" ? styles.credit : styles.expense}
      >
        {item.type === "credit" ? "↑" : "↓"}
      </SharedAccountText>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    width: 40,
  },
  credit: {
    color: colors.green,
  },
  expense: {
    color: colors.red,
  },
  item: {
    alignItems: "center",
    borderBottomColor: colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 10,
  },
  transactionDetails: {
    flex: 1,
  },
});
