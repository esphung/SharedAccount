import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import React from "react";
import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import type { CurrencyInputProps } from "react-native-currency-input";
import CurrencyInput from "react-native-currency-input";
import type { Currency } from "ts-money";
import { Currencies, Money } from "ts-money";

type SharedAccountCurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  containerStyle?: ViewProps["style"];
  currency?: Currency;
} & Omit<CurrencyInputProps, "value" | "onChange">;

const SharedAccountCurrencyInput = React.forwardRef<
  CurrencyInput,
  SharedAccountCurrencyInputProps
>((props, ref) => {
  const {
    value,
    onChange,
    containerStyle,
    currency = Currencies.USD,
    ...rest
  } = props;
  return (
    <View style={StyleSheet.flatten([containerStyle])}>
      <CurrencyInput
        // ref={ref}
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
        renderTextInput={(textInputProps) => (
          <SharedAccountTextInput ref={ref} {...textInputProps} />
        )}
        {...rest}
      />
    </View>
  );
});

export default SharedAccountCurrencyInput;
