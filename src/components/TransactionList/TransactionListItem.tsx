import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
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
            ? `+ ${convertCentsToUSD(item.amount)} (from ${item.name})`
            : `- ${convertCentsToUSD(item.amount)} (${item.category})`}
        </SharedAccountText>
      </View>
      {/* Text-based Indicator for Expense or Credit */}
      <SharedAccountText
        type="transactionType"
        style={item.type === "credit" ? styles.credit : styles.expense}
      >
        {item.type === "credit" ? "↑" : "↓"}
      </SharedAccountText>
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
  transactionDetails: {
    flex: 1,
  },
});
