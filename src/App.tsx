import useDevMenu from "@hooks/useDevMenu";
import RootStack from "@navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

export default function App() {
  useDevMenu();
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
