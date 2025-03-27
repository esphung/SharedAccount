import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import React, { useEffect, useState } from "react";
import type { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps } from "react-native";
import { Platform, StyleSheet } from "react-native";

type Props = Omit<TextInputProps, "value"> & {
  value: number; // in cents
  onChangeValue: (cents: number) => void;
  locale?: string;
  currency?: string;
};

const SharedAccountCurrencyInput = React.forwardRef<TextInput, Props>(
  ({ value = 0, onChangeValue, locale = "en-US", currency = "USD", style, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");
    const [selection, setSelection] = useState<{ start: number; end: number }>({
      start: 0,
      end: 0,
    });

    useEffect(() => {
      const formatted = formatCurrency(value, locale, currency);
      setDisplayValue(formatted);
      setSelection({ start: formatted.length, end: formatted.length });
    }, [value, locale, currency]);

    const handleChangeText = (text: string) => {
      const numeric = text.replace(/[^\d]/g, "");
      const cents = parseInt(numeric || "0", 10);
      const formatted = formatCurrency(cents, locale, currency);

      setDisplayValue(formatted);
      onChangeValue?.(cents);
      setSelection({ start: formatted.length, end: formatted.length });
    };

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      const len = displayValue.length;
      setSelection({ start: len, end: len });

      // Optionally call parent onFocus
      props.onFocus?.(e);
    };

    return (
      <SharedAccountTextInput
        ref={ref}
        keyboardType="numeric"
        value={displayValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        selection={selection}
        contextMenuHidden={true} // hides copy/paste menu
        selectTextOnFocus={false} // don’t auto-select
        style={StyleSheet.flatten([styles.input, style])}
        {...props}
      />
    );
  },
);

function formatCurrency(cents: number, locale: string, currency: string): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

const styles = StyleSheet.create({
  input: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    fontSize: 26,
    fontVariant: ["tabular-nums"],
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: "right",
    width: "100%",
  },
});

export default SharedAccountCurrencyInput;
