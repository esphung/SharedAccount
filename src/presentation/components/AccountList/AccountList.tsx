import CheckMarkSvgIcon from "@assets/svg/checkmark-svgrepo-com.svg";
import CircleMinusSvgIcon from "@assets/svg/circle-minus-svgrepo-com.svg";
import MuseumSvgIcon from "@assets/svg/museum-svgrepo-com.svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { calculateTotal } from "@screens/TransactionsScreen/TransactionsScreen";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import type { Account } from "types/Account";

type AccountListProps = {
  accounts: Account[];
  onPress?: (account: Account) => void;
  selectedAccount?: Account;
  onPressRemove: (account: Account) => void;
};

const ICON_SIZE = 13;

const AccountList = ({ accounts, onPress, selectedAccount, onPressRemove }: AccountListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: Account }) => {
      const total = calculateTotal(item);
      return (
        <TouchableOpacity
          style={[styles.item, selectedAccount?.id === item.id && styles.selected]}
          testID={`account-item-${item.id}`}
          onPress={() => onPress?.(item)}
          activeOpacity={0.7}
        >
          <View style={styles.leftItemPanel}>
            {selectedAccount?.id === item.id && (
              <CheckMarkSvgIcon
                testID={`checkmark-account-item-icon-${item.id}`}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
            )}
            <MuseumSvgIcon testID={`account-item-icon-${item.id}`} width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <View style={styles.centerItemPanel}>
            <SharedAccountText>{item.name}</SharedAccountText>
            <SharedAccountText
              style={Number(total.replace(/\$/g, "")) <= 0 ? styles.balanceNegative : styles.balancePositive}
            >
              {total}
            </SharedAccountText>
          </View>
          {selectedAccount?.id === item.id && (
            <TouchableOpacity
              style={styles.rightItemPanel}
              testID={`account-item-remove-${item.id}`}
              onPress={() => onPressRemove?.(item)}
              activeOpacity={0.7}
            >
              <CircleMinusSvgIcon testID={`account-item-icon-${item.id}`} width={ICON_SIZE} height={ICON_SIZE} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAccount, accounts],
  );

  return <FlatList data={accounts} keyExtractor={(item) => item.id} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  balanceNegative: {
    color: colors.red,
  },
  balancePositive: {
    color: colors.green,
  },
  centerItemPanel: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginLeft: 8,
    marginRight: 8,
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  leftItemPanel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginRight: 8,
  },
  rightItemPanel: {},
  selected: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default AccountList;
