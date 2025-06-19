import { SheetModalProvider } from "@domain/providers/SheetModalProvider";
import useDevMenu from "@presentation/hooks/useDevMenu";
import RootStack from "@presentation/navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { LogBox } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

if (__DEV__) {
	LogBox.ignoreAllLogs();
}

export default function App() {
	useDevMenu();
	return (
		<KeyboardProvider>
			<SheetModalProvider>
				<NavigationContainer>
					<RootStack />
				</NavigationContainer>
			</SheetModalProvider>
		</KeyboardProvider>
	);
}
