import { render } from "@testing-library/react-native";
import React from "react";
import App from "./App";

jest.mock("@presentation/navigators/RootStack/RootStack", () => {
  return function MockRootStack() {
    return <></>;
  };
});

describe("App Component", () => {
  it("matches snapshot", () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toMatchSnapshot();
  });
});
