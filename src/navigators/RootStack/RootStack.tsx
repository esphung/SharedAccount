import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import React from "react";

export enum RootStackScreens {
  Home = "HomeScreen",
}

export type RootStackParamList = {
  [RootStackScreens.Home]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName={RootStackScreens.Home}>
      <Stack.Screen name={RootStackScreens.Home} component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default RootStack;
