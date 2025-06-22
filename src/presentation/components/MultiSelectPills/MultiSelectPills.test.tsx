import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SingleSelectPills from "./MultiSelectPills";
import colors from "@config/themes/colors";

describe("SingleSelectPills", () => {
	const options = [
		{ id: "1", label: "Option 1" },
		{ id: "2", label: "Option 2" },
		{ id: "3", label: "Option 3" },
	];

	it("renders all options", () => {
		const { getByText } = render(
			<SingleSelectPills options={options} selected="" onChange={jest.fn()} />
		);
		options.forEach((option) => {
			expect(getByText(option.label)).toBeTruthy();
		});
	});

	it("highlights the selected option", () => {
		const selected = "Option 2";
		const { getByText } = render(
			<SingleSelectPills options={options} selected={selected} onChange={jest.fn()} />
		);
		const selectedPill = getByText(selected).parent;
		expect(selectedPill?.props.style).toEqual(
			expect.objectContaining({
				color: "rgb(248, 249, 250)",
				fontSize: 16,
				fontWeight: "400",
			})
		);
	});

	it("calls onChange with correct label when an option is pressed", () => {
		const onChange = jest.fn();
		const { getByText } = render(
			<SingleSelectPills options={options} selected="" onChange={onChange} />
		);
		fireEvent.press(getByText("Option 3"));
		expect(onChange).toHaveBeenCalledWith("Option 3");
	});

	it("does not call onChange when disabled", () => {
		const onChange = jest.fn();
		const { getByText } = render(
			<SingleSelectPills options={options} selected="" onChange={onChange} disabled />
		);
		fireEvent.press(getByText("Option 1"));
		expect(onChange).not.toHaveBeenCalled();
	});

	it("renders with empty options", () => {
		const { toJSON } = render(
			<SingleSelectPills options={[]} selected="" onChange={jest.fn()} />
		);
		expect(toJSON()).toMatchSnapshot();
	});

	it("applies correct text color for selected and unselected pills", () => {
		const { getByText } = render(
			<SingleSelectPills options={options} selected="Option 1" onChange={jest.fn()} />
		);
		const selectedText = getByText("Option 1");
		const unselectedText = getByText("Option 2");
		expect(selectedText.props.style).toEqual(expect.objectContaining({ color: colors.light }));
		expect(unselectedText.props.style).toEqual(expect.objectContaining({ color: colors.dark }));
	});
});
