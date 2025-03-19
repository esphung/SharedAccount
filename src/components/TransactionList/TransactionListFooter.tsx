import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TransactionListFooter() {
  return (
    <View style={styles.footer}>
      <SharedAccountButton type="secondary" title="Add an expense" />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
  },
});
