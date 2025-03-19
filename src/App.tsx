import RootStack from "@navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { DevSettings } from "react-native";
import { Dirs } from "react-native-file-access";

export default function App() {
  // Debugging
  React.useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem("Show DB", () => {
        console.log("DB Path:", Dirs.DocumentDir);
      });
    }
  }, []);

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
