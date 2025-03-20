import colors from "@config/themes/colors";
import React from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";

const SharedAccountTextInput = React.forwardRef<TextInput, TextInputProps>(
  (props, ref) => {
    const { style, ...otherProps } = props;
    return (
      <TextInput ref={ref} style={[styles.textInput, style]} {...otherProps} />
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: "600",
    height: 20,
  },
});

export default SharedAccountTextInput;
