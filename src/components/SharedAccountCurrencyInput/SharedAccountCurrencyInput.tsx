import React from "react";
import { View, type ViewStyle } from "react-native";
import type { CurrencyInputProps } from "react-native-currency-input";
import CurrencyInput from "react-native-currency-input";

export type SharedAccountCurrencyInputProps = {
  value: number;
  onChange: (value: number | null) => void;
  containerStyle?: ViewStyle;
} & CurrencyInputProps;

function SharedAccountCurrencyInput(props: SharedAccountCurrencyInputProps) {
  const { value, onChange, containerStyle, ...rest } = props;
  return (
    <View style={containerStyle}>
      <CurrencyInput
        placeholder={"Enter amount"}
        value={value}
        onChangeValue={onChange}
        prefix="$"
        delimiter=","
        separator="."
        precision={2}
        maxLength={12}
        maxValue={100000}
        {...rest}
      />
    </View>
  );
}

export default SharedAccountCurrencyInput;
