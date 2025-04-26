import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SkeletonLoader from "@components/SkeletonLoader/SkeletonLoader";
import colors from "@config/themes/colors";

import type { Transaction } from "@data/models/types/Transaction";
import type { User } from "@data/models/types/User";
import MoneyFunctions from "@utils/MoneyFunctions";
import { DateTime } from "luxon";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type TransactionListItemProps = {
  item: Transaction;
  user?: User;
  onPress: (id: string) => void;
  itemHeight: number;
  isListReady?: boolean;
};

export default function TransactionListItem({
  item,
  user,
  onPress,
  itemHeight,
  isListReady = false,
}: TransactionListItemProps) {
  if (!isListReady) {
    return <ExpensesLoadingPlaceholder itemHeight={itemHeight} />;
  }

  const isCredit = item.type === "credit";
  const formattedAmount = MoneyFunctions.formatMoney(item.amount, 2);
  const avatarUri = user?.avatar || "https://picsum.photos/200/300";

  return (
    <TouchableOpacity
      testID="transaction-list-item"
      style={[styles.item, { height: itemHeight }]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <Image testID="avatar-image" style={styles.avatar} source={{ uri: avatarUri }} />
      <View style={styles.transactionDetails}>
        <SharedAccountText type="listItemTitle">{user?.name || "Unknown User"}</SharedAccountText>
        <SharedAccountText type="listItemSubtitle">
          {isCredit ? `+ ${formattedAmount} (from ${item.name})` : `- ${formattedAmount} (${item.category})`}
        </SharedAccountText>
      </View>
      <View style={styles.rightPanel}>
        <SharedAccountText type="transactionType" style={isCredit ? styles.credit : styles.expense}>
          {isCredit ? "↑" : "↓"}
        </SharedAccountText>
        <SharedAccountText type="listItemSubtitle">
          {DateTime.fromJSDate(item.date).toFormat("MMM d, t")}
        </SharedAccountText>
      </View>
    </TouchableOpacity>
  );
}

function ExpensesLoadingPlaceholder({ itemHeight }: { itemHeight: number }) {
  return (
    <View style={[styles.loadingPlaceholderContainer, { height: itemHeight }]}>
      <SkeletonLoader width="60%" height={18} style={styles.skeletonTitle} />
      <SkeletonLoader width="100%" height={36} style={styles.skeletonSubtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    marginRight: 12,
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
    padding: 12,
  },
  loadingPlaceholderContainer: {
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rightPanel: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
  },
  skeletonSubtitle: {
    marginTop: 4,
  },
  skeletonTitle: {
    marginBottom: 8,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: "center",
  },
});
