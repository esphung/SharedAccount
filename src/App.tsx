import { SheetModalProvider } from "@domain/providers/SheetModalProvider";
import useDevMenu from "@presentation/hooks/useDevMenu";
import RootStack from "@presentation/navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { LogBox } from "react-native";
import { Auth0Provider } from "react-native-auth0";
import { KeyboardProvider } from "react-native-keyboard-controller";

if (__DEV__) {
	LogBox.ignoreAllLogs();
}

export default function App() {
	useDevMenu();
	return (
		<KeyboardProvider>
			<SheetModalProvider>
				<Auth0Provider
					domain={"dev-ffksazh23yw1bfhr.us.auth0.com"}
					clientId={"pyi4vQIdPj0QaCgETV59PF9aZ7CvGsKG"}
				>
					<NavigationContainer>
						<RootStack />
					</NavigationContainer>
				</Auth0Provider>
			</SheetModalProvider>
		</KeyboardProvider>
	);
}
