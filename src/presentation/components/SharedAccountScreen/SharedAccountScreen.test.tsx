import { render, screen } from "@testing-library/react-native";
import React from "react";
// eslint-disable-next-line no-restricted-imports
import { Text } from "react-native";
import SharedAccountScreen from "./SharedAccountScreen";

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
		expect(container.props.style).toEqual(
			expect.objectContaining({
				backgroundColor: "red",
				flex: 1,
			})
		);
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
