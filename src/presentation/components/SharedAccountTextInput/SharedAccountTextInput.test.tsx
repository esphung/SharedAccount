import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SharedAccountTextInput from "./SharedAccountTextInput";
import colors from "@config/themes/colors";
import { StyleSheet } from "react-native";

describe("SharedAccountTextInput", () => {
	it("renders with default placeholder", () => {
		const { getByPlaceholderText } = render(<SharedAccountTextInput />);
		expect(getByPlaceholderText("Type here...")).toBeTruthy();
	});

	it("renders with custom placeholder", () => {
		const placeholder = "Enter your name";
		const { getByPlaceholderText } = render(
			<SharedAccountTextInput placeholder={placeholder} />
		);
		expect(getByPlaceholderText(placeholder)).toBeTruthy();
	});

	it("renders with given value", () => {
		const value = "Hello";
		const { getByDisplayValue } = render(<SharedAccountTextInput value={value} />);
		expect(getByDisplayValue(value)).toBeTruthy();
	});

	it("calls onChangeText when text changes", () => {
		const onChangeText = jest.fn();
		const { getByPlaceholderText } = render(
			<SharedAccountTextInput onChangeText={onChangeText} />
		);
		fireEvent.changeText(getByPlaceholderText("Type here..."), "New Value");
		expect(onChangeText).toHaveBeenCalledWith("New Value");
	});

	it("applies default styles", () => {
		const { getByPlaceholderText } = render(<SharedAccountTextInput />);
		const input = getByPlaceholderText("Type here...");
		expect(input.props.style).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					borderBottomWidth: StyleSheet.hairlineWidth,
					borderColor: colors.dark,
					color: colors.dark,
					fontSize: 16,
					fontWeight: "600",
					height: 50,
					paddingHorizontal: 8,
				}),
			])
		);
	});

	it("applies custom style", () => {
		const customStyle = { backgroundColor: "yellow" };
		const { getByPlaceholderText } = render(<SharedAccountTextInput style={customStyle} />);
		const input = getByPlaceholderText("Type here...");
		expect(input.props.style).toEqual(
			expect.arrayContaining([expect.objectContaining({ backgroundColor: "yellow" })])
		);
	});
});
