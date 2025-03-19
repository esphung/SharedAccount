import React from "react";
import type { ViewProps } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";

export type SharedAccountScreenProps = {
  // add props here
  children?: React.ReactNode;
} & ViewProps;

export default function SharedAccountScreen(props: SharedAccountScreenProps) {
  const { children, style, ...rest } = props;
  return (
    <SafeAreaView
      style={StyleSheet.flatten([styles.container, style])}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
