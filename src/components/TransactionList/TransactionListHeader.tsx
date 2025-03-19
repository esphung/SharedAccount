import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import { StyleSheet } from "react-native";

export default function TransactionListHeader({
  title,
  type,
}: {
  title: string;
  type: "listSectionHeader" | "listHeader";
}) {
  return (
    <SharedAccountText type={type} style={styles.header}>
      {title}
    </SharedAccountText>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 8,
  },
});
