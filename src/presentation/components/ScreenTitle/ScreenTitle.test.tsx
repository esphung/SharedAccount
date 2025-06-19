import { render, screen } from "@testing-library/react-native";
import React from "react";

import ScreenTitle from "./ScreenTitle";

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

	it("applies the correct styles to the subtitle container", () => {
		render(<ScreenTitle title="Main Title" subtitle="Styled Subtitle" />);
		const subtitleContainer = screen.getByTestId("screen-subtitle-container");

		expect(subtitleContainer.props.style).toMatchObject({
			paddingVertical: 8,
		});
	});

	it("renders the subtitle with the correct type", () => {
		render(<ScreenTitle title="Main Title" subtitle="Subtitle" />);
		const subtitleText = screen.getByTestId("screen-subtitle-text");
		expect(subtitleText.props.type).toBe("listItemSubtitle");
	});

	it("renders the title with the correct type", () => {
		render(<ScreenTitle title="Main Title" />);
		const titleText = screen.getByTestId("screen-title-text");
		expect(titleText.props.type).toBe("screenHeader");
	});
});
