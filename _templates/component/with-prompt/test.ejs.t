---
to: src/presentation/components/<%= message %>/<%= message %>.test.tsx
---
import { render } from "@testing-library/react-native";
import React from "react";
import <%= message %> from "./<%= message %>";

it.todo("should be implemented");
describe("<%= message %> Component", () => {
  it("should render correctly", () => {
    const { getByText } = render(<<%= message %> />);
    const textElement = getByText("<%= message %>");
    expect(textElement).toBeTruthy();
  });

  it("should apply the correct styles", () => {
    const { getByText } = render(<<%= message %> />);
    const textElement = getByText("<%= message %>");
    expect(textElement.props.style).toMatchObject({
      color: "rgb(52, 58, 64)",
      fontSize: 24,
    });
  });
});
