import { render, screen } from "@testing-library/react-native";
import React from "react";

import ScreenTitle from "./ScreenTitle";

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

describe("ScreenTitle", () => {
	it("renders correctly with the given title", () => {
		render(<ScreenTitle title="Test Title" />);
		expect(screen.getByText("Test Title")).toBeTruthy();
	});

	it("applies the correct styles to the container", () => {
		render(<ScreenTitle title="Styled Title" />);
		const container = screen.getByTestId("screen-title-container");

		expect(container.props.style).toMatchObject({
			paddingVertical: 8,
		});
	});

	it("renders the subtitle when provided", () => {
		render(<ScreenTitle title="Main Title" subtitle="Subtitle" />);
		expect(screen.getByText("Subtitle")).toBeTruthy();
	});

	it("does not render the subtitle when not provided", () => {
		render(<ScreenTitle title="Main Title" />);
		expect(screen.queryByText("Subtitle")).toBeFalsy();
	});
});
