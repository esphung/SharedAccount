import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabNavigatorProps } from "node_modules/@react-navigation/bottom-tabs/lib/typescript/module/src/types";
import React from "react";

type TabRoutesParam = {
  name: string;
  component: React.ComponentType;
};

export default function createTabNavigator(
  routes: TabRoutesParam[],
  options: Omit<BottomTabNavigatorProps, "id" | "children"> = {},
) {
  const TAG = `tab-navigator-${Date.now().toString().slice(0, 5)}`;
  const Tab = createBottomTabNavigator();
  return () => {
    return (
      <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} {...options}>
        {routes.map(({ name, component }) => (
          <Tab.Screen name={name} key={`${TAG}-${`screen-${name}`}`} component={component} />
        ))}
      </Tab.Navigator>
    );
  };
}
