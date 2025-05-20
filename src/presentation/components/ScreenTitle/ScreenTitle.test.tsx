import { render } from "@testing-library/react-native";
import React from "react";

import ScreenTitle from "./ScreenTitle";

describe("ScreenTitle", () => {
  it("matches snapshot", () => {
    const { toJSON } = render(<ScreenTitle title="Test Title" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with the given title", () => {
    const { getByText } = render(<ScreenTitle title="Test Title" />);

    expect(getByText("Test Title")).toBeTruthy();
  });

  it("applies the correct styles to the container", () => {
    const { getByTestId } = render(<ScreenTitle title="Styled Title" />);
    const container = getByTestId("screen-title-container");

    expect(container.props.style).toMatchObject({
      paddingHorizontal: 16,
      paddingVertical: 8,
    });
  });
});
