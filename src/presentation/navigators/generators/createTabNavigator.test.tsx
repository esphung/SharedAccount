import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import createTabNavigator from "./createTabNavigator";

jest.mock("@react-navigation/bottom-tabs", () => {
  return {
    createBottomTabNavigator: () => {
      return {
        Navigator: jest.fn(),
      };
    },
  };
});

describe("createTabNavigator", () => {
  it("renders a tab navigator with the provided routes", () => {
    const MockComponent1 = () => <></>;
    const MockComponent2 = () => <></>;

    const routes = [
      { name: "Tab1", component: MockComponent1 },
      { name: "Tab2", component: MockComponent2 },
    ];

    const TabNavigator = createTabNavigator(routes);

    const { toJSON } = render(
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
