import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function BillsSectionListHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <SharedAccountText type="listHeader">{title}</SharedAccountText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.light,
    padding: 8,
  },
});
