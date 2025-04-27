// testUtils/sharedTests.ts
import { render } from "@testing-library/react-native";
import React from "react";

export function itMatchesSnapshot(Component: React.ElementType, props: Record<string, unknown> = {}) {
  it("matches snapshot", () => {
    const component = <Component {...props} />;
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });
}
