import { SheetModalProvider } from "@domain/providers/SheetModalProvider";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "@env";
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
				<Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
					<NavigationContainer>
						<RootStack />
					</NavigationContainer>
				</Auth0Provider>
			</SheetModalProvider>
		</KeyboardProvider>
	);
}
