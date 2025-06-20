import { render, screen, userEvent } from "@testing-library/react-native";
import React from "react";
import CircleButton from "./CircleButton";
// eslint-disable-next-line no-restricted-imports
import { Text } from "react-native";

describe("CircleButton", () => {
	const mockOnPress = jest.fn();
	it("renders children correctly", async () => {
		render(
			<CircleButton onPress={mockOnPress}>
				<Text>Test Child</Text>
			</CircleButton>
		);
		expect(screen.getByText("Test Child")).toBeVisible();
	});

	it("calls onPress when pressed", async () => {
		render(
			<CircleButton onPress={mockOnPress}>
				<Text>Press me</Text>
			</CircleButton>
		);
		await userEvent.press(screen.getByRole("button"));
		expect(mockOnPress).toHaveBeenCalledTimes(1);
	});

	it("renders without children", () => {
		render(<CircleButton onPress={() => {}} />);
		expect(screen.getByRole("button")).toBeTruthy();
	});
});
