import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { calculateTotal } from "@screens/TransactionsScreen/TransactionsScreen";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import type { Account } from "types/Account";

type AccountListProps = {
  accounts: Account[];
  onPress?: (account: Account) => void;
  selectedAccount?: Account;
};

const AccountList = ({ accounts, onPress, selectedAccount }: AccountListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: Account }) => (
      <TouchableOpacity
        testID={`account-item-${item.id}`}
        style={[styles.item, selectedAccount?.id === item.id && styles.selected]}
        onPress={() => onPress?.(item)}
        activeOpacity={0.7}
      >
        <SharedAccountText>{item.name}</SharedAccountText>
        <SharedAccountText style={styles.balance}>{calculateTotal(item)}</SharedAccountText>
      </TouchableOpacity>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAccount],
  );

  return <FlatList data={accounts} keyExtractor={(item) => item.id} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  balance: {
    color: colors.green,
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  selected: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default AccountList;
