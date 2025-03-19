import React from "react";
import { View, type ViewStyle } from "react-native";
import type { CurrencyInputProps } from "react-native-currency-input";
import CurrencyInput from "react-native-currency-input";
import type { Currency } from "ts-money";
import { Currencies, Money } from "ts-money";

export type SharedAccountCurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  containerStyle?: ViewStyle;
  currency?: Currency;
} & Omit<CurrencyInputProps, "value" | "onChange">;

function SharedAccountCurrencyInput(props: SharedAccountCurrencyInputProps) {
  const {
    value,
    onChange,
    containerStyle,
    currency = Currencies.USD,
    ...rest
  } = props;
  return (
    <View style={containerStyle}>
      <CurrencyInput
        placeholder={"Enter amount"}
        value={new Money(value, currency).toDecimal()}
        onChangeValue={(newValue) => {
          const someCents = Money.fromDecimal(newValue || 0, currency);
          onChange(someCents.amount || 0);
        }}
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
