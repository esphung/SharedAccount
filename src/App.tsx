import useDevMenu from "@hooks/useDevMenu";
import RootStack from "@navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function App() {
  useDevMenu();
  return (
    <KeyboardProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </KeyboardProvider>
  );
}
