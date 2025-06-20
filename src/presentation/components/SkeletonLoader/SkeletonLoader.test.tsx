import { render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";

import SkeletonLoader from "./SkeletonLoader";
import colors from "@config/themes/colors";

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
