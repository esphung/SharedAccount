import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function UpcomingBillsSectionListFooter({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <View style={styles.footer}>
      <SharedAccountButton title="Add a bill" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
  },
});
