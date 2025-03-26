import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { DateTime } from "luxon";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import type { Transaction } from "types/Transaction";
import type { User } from "types/User";

const convertCentsToUSD = (amount: number) => {
  // convert cents to dollars
  return `$${(amount / 100).toFixed(2)}`;
};

export default function TransactionListItem({
  item,
  user,
  onPress,
}: {
  item: Transaction;
  user?: User;
  onPress: (id: string) => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item.id)}>
      {/* User Avatar */}
      <Image
        style={styles.avatar}
        source={{
          uri: user?.avatar ? user.avatar : "https://picsum.photos/200/300",
        }}
      />
      {/* Transaction Info */}
      <View style={styles.transactionDetails}>
        <SharedAccountText type="listItemTitle">
          {user?.name || "Unknown User"}
        </SharedAccountText>
        <SharedAccountText type="listItemSubtitle">
          {item.type === "credit"
            ? `+ ${convertCentsToUSD(item.amount)} (from ${item.name})`
            : `- ${convertCentsToUSD(item.amount)} (${item.category})`}
        </SharedAccountText>
      </View>
      {/* Text-based Indicator for Expense or Credit */}
      <View style={styles.rightPanel}>
        <SharedAccountText
          type="transactionType"
          style={item.type === "credit" ? styles.credit : styles.expense}
        >
          {item.type === "credit" ? "↑" : "↓"}
        </SharedAccountText>
        <SharedAccountText>
          {DateTime.fromJSDate(item.date).toFormat("MMM d, t")}
        </SharedAccountText>
      </View>
    </TouchableOpacity>
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
  rightPanel: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  transactionDetails: {
    flex: 1,
  },
});
