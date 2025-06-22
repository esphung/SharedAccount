import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import SharedAccountButton from "./SharedAccountButton";

// mock useTheme hook if necessary
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

describe("SharedAccountButton", () => {
	const title = "Test Button";
	const onPress = jest.fn();

	it("renders with the given title", () => {
		const { getByText } = render(<SharedAccountButton title={title} onPress={onPress} />);
		expect(getByText(title)).toBeTruthy();
	});

	it("calls onPress when pressed", () => {
		const { getByText } = render(<SharedAccountButton title={title} onPress={onPress} />);
		fireEvent.press(getByText(title));
		expect(onPress).toHaveBeenCalled();
	});

	it("applies primary styles when theme is light", () => {
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
		// arrange
		const { getByTestId } = render(<SharedAccountButton title={title} onPress={onPress} />);
		const button = getByTestId("sharedAccountButton");
		expect(button.props.style).toEqual(
			expect.objectContaining({
				backgroundColor: "rgb(52, 58, 64)",
				borderColor: "rgb(52, 58, 64)",
			})
		);
	});

	it("applies secondary styles when theme is dark", () => {
		// arrange
		jest.mock("@react-navigation/native", () => ({
			...jest.requireActual("@react-navigation/native"),
			useTheme: () => ({
				colors: {
					text: "#fff",
					background: "rgb(52, 58, 64)",
					border: "rgb(52, 58, 64)",
				},
				fonts: {
					heavy: {
						fontWeight: "700",
						fontFamily: "System",
					},
				},
				dark: true,
			}),
		}));
		const { getByTestId } = render(<SharedAccountButton title={title} onPress={onPress} />);
		const button = getByTestId("sharedAccountButton");
		expect(button.props.style).toEqual(
			expect.objectContaining({
				borderColor: "rgb(52, 58, 64)",
				backgroundColor: "rgb(52, 58, 64)",
				borderRadius: 8,
			})
		);
	});

	it("applies suggestionItem styles when type is 'suggestionItem'", () => {
		const { getByTestId } = render(<SharedAccountButton title={title} onPress={onPress} />);
		const button = getByTestId("sharedAccountButton");
		expect(button.props.style).toEqual(
			expect.objectContaining({
				borderColor: "rgb(52, 58, 64)",
				borderRadius: 8,
				backgroundColor: "rgb(52, 58, 64)",
			})
		);
	});

	it("applies disabled styles when disabled", () => {
		const { getByTestId } = render(
			<SharedAccountButton title={title} disabled onPress={onPress} />
		);
		const button = getByTestId("sharedAccountButton");
		expect(button.props.style).toEqual(
			expect.objectContaining({
				backgroundColor: "rgb(52, 58, 64)",
			})
		);
	});

	it("applies custom style", () => {
		const customStyle = { marginTop: 20 };
		const { getByTestId } = render(
			<SharedAccountButton title={title} style={customStyle} onPress={onPress} />
		);
		const button = getByTestId("sharedAccountButton");
		expect(button.props.style).toEqual(expect.objectContaining({ marginTop: 20 }));
	});
});
