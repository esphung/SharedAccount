import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import { StyleSheet, View } from "react-native";

type ScreenTitleProps = { title: string };

export default function ScreenTitle({ title }: ScreenTitleProps) {
  return (
    <View testID="screen-title-container" style={styles.container}>
      <SharedAccountText type="screenHeader">{title}</SharedAccountText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
