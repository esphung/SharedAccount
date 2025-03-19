import React from "react";
import type { TextProps } from "react-native";
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, Text } from "react-native";

type SharedAccountTextProps = {
  type?: keyof typeof styles;
} & TextProps;

export default function SharedAccountText(props: SharedAccountTextProps) {
  const { children, style, ...rest } = props;
  return (
    <Text
      style={StyleSheet.flatten([styles[props.type || "primary"], style])}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primary: {
    fontSize: 16,
    fontWeight: "400",
  },
  screenHeader: {
    fontSize: 28,
    fontWeight: "900",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "700",
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  listItemSubtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  transactionType: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  listSectionHeader: {
    fontSize: 16,
    fontWeight: "700",
  },
});
