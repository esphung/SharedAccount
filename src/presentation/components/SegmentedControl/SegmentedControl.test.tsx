import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SegmentedControl from "./SegmentedControl";

jest.mock("@react-navigation/native", () => ({
	...jest.requireActual("@react-navigation/native"),
	useTheme: () => ({
		colors: {
			text: "#000",
			background: "rgb(52, 58, 64)",
			border: "rgb(52, 58, 64)",
		},
		fonts: {
			heavy: {
				fontWeight: "700",
				fontFamily: "System",
			},
		},
		dark: false,
	}),
}));

describe("SegmentedControl", () => {
	const options = ["Option 1", "Option 2", "Option 3"];
	const onSelect = jest.fn();

	it("renders all options", () => {
		const { getByText } = render(<SegmentedControl options={options} onSelect={onSelect} />);
		options.forEach((option) => {
			expect(getByText(option)).toBeTruthy();
		});
	});

	it("calls onSelect with correct index when an option is pressed", () => {
		const { getByText } = render(<SegmentedControl options={options} onSelect={onSelect} />);
		fireEvent.press(getByText("Option 2"));
		expect(onSelect).toHaveBeenCalledWith(1);
	});

	it("applies selected style to the correct option", () => {
		const { getAllByText } = render(
			<SegmentedControl options={options} selectedIndex={2} onSelect={onSelect} />
		);
		const selectedOption = getAllByText("Option 3")[0];
		// The selected style sets borderColor to colors.primary
		expect(selectedOption.parent?.props.style).toEqual({
			color: "rgb(106, 178, 193)",
			fontSize: 16,
			fontWeight: "bold",
			textAlign: "center",
		});
	});

	it("updates selected option when pressed", () => {
		const { getByText } = render(<SegmentedControl options={options} onSelect={onSelect} />);
		fireEvent.press(getByText("Option 3"));
		fireEvent.press(getByText("Option 1"));
		expect(onSelect).toHaveBeenCalledWith(2);
		expect(onSelect).toHaveBeenCalledWith(0);
	});

	it("applies custom containerStyle", () => {
		const customStyle = { backgroundColor: "red" };
		const { UNSAFE_getByType } = render(
			<SegmentedControl options={options} onSelect={onSelect} containerStyle={customStyle} />
		);
		// @ts-expect-error unsafe_getByType is a private API
		const flatList = UNSAFE_getByType("RCTScrollView");
		expect(flatList.props.contentContainerStyle).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ alignItems: "center" }),
				expect.objectContaining(customStyle),
			])
		);
	});
});
