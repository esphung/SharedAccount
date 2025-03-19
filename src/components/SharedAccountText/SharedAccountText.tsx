import React from "react";
import type { TextProps } from "react-native";
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, Text } from "react-native";

type SharedAccountTextProps = {
  type?: keyof typeof styles;
} & TextProps;

export default function SharedAccountText(props: SharedAccountTextProps) {
  const { children, ...rest } = props;
  return (
    <Text style={styles[props.type || "primary"]} {...rest}>
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
    fontWeight: "900",
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  listItemSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
});
