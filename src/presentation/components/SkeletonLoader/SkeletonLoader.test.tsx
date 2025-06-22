import colors from "@config/themes/colors";
import { render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";
import SkeletonLoader from "./SkeletonLoader";

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

describe("SkeletonLoader", () => {
	it("matches snapshot with default props", () => {
		const { toJSON } = render(<SkeletonLoader />);
		expect(toJSON()).toMatchSnapshot();
	});

	it("matches snapshot with custom props", () => {
		const { toJSON } = render(
			<SkeletonLoader
				width={200}
				height={100}
				borderRadius={10}
				style={{ backgroundColor: colors.green }}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
	});

	it("animates shimmer effect", () => {
		jest.spyOn(Animated, "loop").mockImplementation(() => ({
			start: jest.fn(),
			stop: jest.fn(),
			reset: jest.fn(),
		}));
		const { getByTestId } = render(<SkeletonLoader />);
		const skeletonLoader = getByTestId("skeleton-loader");

		expect(skeletonLoader).toBeTruthy();

		expect(Animated.loop).toHaveBeenCalled();
	});
});
