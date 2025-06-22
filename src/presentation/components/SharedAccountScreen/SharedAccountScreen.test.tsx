import { render, screen } from "@testing-library/react-native";
import React from "react";
// eslint-disable-next-line no-restricted-imports
import { Text } from "react-native";
import SharedAccountScreen from "./SharedAccountScreen";

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

describe("SharedAccountScreen", () => {
	it("renders children correctly", () => {
		render(
			<SharedAccountScreen>
				<Text>Test Child</Text>
			</SharedAccountScreen>
		);
		expect(screen.getByText("Test Child")).toBeVisible();
	});

	it("applies custom style", () => {
		const testStyle = { backgroundColor: "red", flex: 1 };
		render(
			<SharedAccountScreen style={testStyle} testID="container">
				<Text>Test Child</Text>
			</SharedAccountScreen>
		);
		const container = screen.getByTestId("container");
		expect(container.props.style).toEqual([
			{ flex: 1 },
			{ backgroundColor: "rgb(52, 58, 64)" },
			{ backgroundColor: "red", flex: 1 },
		]);
	});

	it("passes additional props to SafeAreaView", () => {
		render(
			<SharedAccountScreen accessibilityLabel="shared-account" testID="container">
				<Text>Test Child</Text>
			</SharedAccountScreen>
		);
		const container = screen.getByTestId("container");
		expect(container.props.accessibilityLabel).toBe("shared-account");
		expect(container.props.testID).toBe("container");
	});
});
