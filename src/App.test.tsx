import { render } from "@testing-library/react-native";
import React from "react";
import App from "./App";

jest.mock("@presentation/hooks/useDevMenu", () => {
	return jest.fn();
});

jest.mock("@presentation/navigators/RootStack/RootStack", () => {
	return function MockRootStack() {
		return null;
	};
});

describe("App Component", () => {
	it("renders without crashing", () => {
		const tree = render(<App />);
		expect(tree).toBeTruthy();
	});
});
