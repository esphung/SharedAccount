import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import { StyleSheet, View } from "react-native";

type ScreenTitleProps = { title: string; subtitle?: string };

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.row}>
      <View testID="screen-title-container" style={styles.container}>
        <SharedAccountText type="screenHeader">{title}</SharedAccountText>
      </View>
      <View testID="screen-subtitle-container" style={styles.container}>
        <SharedAccountText type="listItemSubtitle">{subtitle}</SharedAccountText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
});

export default ScreenTitle;

ScreenTitle.displayName = "ScreenTitle";
