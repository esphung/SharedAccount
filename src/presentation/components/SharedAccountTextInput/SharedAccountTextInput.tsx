import colors from "@config/themes/colors";
import React from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";

const SharedAccountTextInput = React.forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { value, style, onChangeText, placeholder = "Type here...", ...otherProps } = props;
  return (
    <TextInput
      ref={ref}
      placeholder={placeholder}
      style={[styles.textInput, style]}
      value={value}
      onChangeText={(text) => {
        onChangeText?.(text);
      }}
      {...otherProps}
    />
  );
});

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.dark,
    color: colors.dark,
    fontSize: 16,
    fontWeight: "600",
    height: 50,
    paddingHorizontal: 8,
  },
});

export default SharedAccountTextInput;
