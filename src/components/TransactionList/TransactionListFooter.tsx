import React from "react";
import { StyleSheet, View } from "react-native";

export default function TransactionListFooter({}: { onPress: () => void }) {
  return <View style={styles.footer} />;
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
  },
});
