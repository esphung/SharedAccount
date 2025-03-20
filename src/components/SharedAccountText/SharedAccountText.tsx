import colors from "@config/themes/colors";
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
  // eslint-disable-next-line react-native/no-unused-styles
  buttonTitle: {
    color: colors.light,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  expenseFormError: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "400",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  expenseFormLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  listHeader: {
    fontSize: 18,
    fontWeight: "700",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  listItemSubtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  listItemTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  listSectionHeader: {
    fontSize: 16,
    fontWeight: "700",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  primary: {
    fontSize: 16,
    fontWeight: "400",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  screenHeader: {
    fontSize: 28,
    fontWeight: "900",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  transactionType: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
