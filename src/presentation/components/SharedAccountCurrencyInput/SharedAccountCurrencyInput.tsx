import React, { forwardRef, useCallback, useEffect, useState } from "react";

import type {
	NativeSyntheticEvent,
	TextInput,
	TextInputFocusEventData,
	TextInputProps,
} from "react-native";
import { StyleSheet } from "react-native";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";

type Props = Omit<TextInputProps, "value"> & {
	value: number; // in cents
	onChangeValue: (cents: number) => void;
	locale?: string;
	currency?: string;
	onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

const calculateNewCursorPosition = (
	oldText: string,
	newText: string,
	oldCursor: number
): number => {
	const diff = newText.length - oldText.length;
	return Math.max(0, oldCursor + diff);
};

const SharedAccountCurrencyInput = forwardRef<TextInput, Props>(
	(
		{ value = 0, onChangeValue, locale = "en-US", currency = "USD", style, onFocus, ...props },
		ref
	) => {
		const [displayValue, setDisplayValue] = useState<string>("");
		const [selection, setSelection] = useState<{
			start: number;
			end: number;
		}>({
			start: 0,
			end: 0,
		});

		useEffect(() => {
			const formatted = formatCurrency(value, locale, currency);
			setDisplayValue(formatted);
			setCursorToEnd(formatted.length);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value, locale, currency]);

		const setCursorToEnd = useCallback((position: number) => {
			setSelection({ start: position, end: position });
		}, []);

		const handleChangeText = useCallback(
			(text: string) => {
				const numericString = text.replace(/[^\d]/g, "");
				const cents = parseInt(numericString || "0", 10);
				const formatted = formatCurrency(cents, locale, currency);

				onChangeValue(cents);

				if (formatted !== displayValue) {
					const newCursor = calculateNewCursorPosition(
						displayValue,
						formatted,
						selection.start
					);
					setDisplayValue(formatted);
					setSelection({ start: newCursor, end: newCursor });
				}
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[displayValue, locale, currency, selection.start]
		);

		const handleFocus = useCallback(
			(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
				setCursorToEnd(displayValue.length);
				onFocus?.(e);
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[displayValue.length]
		);

		const memoizedStyle = React.useMemo(
			() => StyleSheet.flatten([styles.input, style]),
			[style]
		);

		return (
			<SharedAccountTextInput
				ref={ref}
				keyboardType="numeric"
				value={displayValue}
				onChangeText={handleChangeText}
				onFocus={handleFocus}
				selection={selection}
				contextMenuHidden
				selectTextOnFocus={false}
				style={memoizedStyle}
				{...props}
			/>
		);
	}
);

const formatCurrency = (cents: number, locale: string, currency: string): string => {
	const dollars = cents / 100;
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(dollars);
};

const styles = StyleSheet.create({
	input: {
		alignItems: "center",
		borderBottomWidth: 0,
		fontSize: 40,
		textAlign: "center",
	},
});

export default SharedAccountCurrencyInput;
