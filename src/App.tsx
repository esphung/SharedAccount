import RealmTransaction from "@models/realm/RealmTransaction";
import RootStack from "@navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import { RealmProvider } from "@realm/react";
import React from "react";
import { DevSettings } from "react-native";
import { Dirs } from "react-native-file-access";

export default function App() {
  React.useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem("Show DB", () => {
        console.log("DB Path:", Dirs.DocumentDir);
      });
    }
  }, []);
  return (
    <RealmProvider schema={[RealmTransaction]} schemaVersion={1}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </RealmProvider>
  );
}
