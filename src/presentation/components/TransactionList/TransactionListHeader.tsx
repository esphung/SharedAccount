import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import React from "react";
import { StyleSheet } from "react-native";

export default function TransactionListHeader({ title }: { title: string }) {
  return (
    <SharedAccountText type="transactionType" style={styles.header}>
      {title}
    </SharedAccountText>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomColor: colors.light,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
