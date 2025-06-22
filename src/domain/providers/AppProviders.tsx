import { navigationThemes } from "@config/themes/navigation";
import { SheetModalProvider } from "@domain/providers/SheetModalProvider";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "@env";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";
import type { Auth0Options } from "react-native-auth0";
import { Auth0Provider } from "react-native-auth0";
import { KeyboardProvider } from "react-native-keyboard-controller";

type AppProvidersProps = { children: React.ReactNode };

const auth0Props: Auth0Options = {
	domain: AUTH0_DOMAIN,
	clientId: AUTH0_CLIENT_ID,
};

export default function AppProviders({ children }: AppProvidersProps) {
	const colorScheme = useColorScheme();

	return (
		<KeyboardProvider>
			<SheetModalProvider>
				<Auth0Provider {...auth0Props}>
					<NavigationContainer theme={navigationThemes[colorScheme || "dark"]}>
						{children}
					</NavigationContainer>
				</Auth0Provider>
			</SheetModalProvider>
		</KeyboardProvider>
	);
}
