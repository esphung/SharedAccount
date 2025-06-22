import type { StackNavigatorProps } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreenComponent from "@screens/LoginScreen/LoginScreen";

enum AuthStackScreens {
	LoginScreen = "LoginScreen",
}

export type AuthStackParamList = {
	[AuthStackScreens.LoginScreen]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const stackNavigatorProps = {
	screenOptions: {
		headerShown: false,
		animation: "fade_from_bottom",
		gestureEnabled: false,
		// Ensures the background is transparent for the fade effect
		cardStyle: { backgroundColor: "transparent" },
	},
	initialRouteName: AuthStackScreens.LoginScreen as keyof AuthStackParamList,
} satisfies {
	screenOptions: StackNavigatorProps["screenOptions"]; // StackNavigationOptions
	initialRouteName: keyof AuthStackParamList;
};

function AuthStack() {
	return (
		<Stack.Navigator {...stackNavigatorProps}>
			<Stack.Screen name={AuthStackScreens.LoginScreen} component={LoginScreenComponent} />
		</Stack.Navigator>
	);
}

export default AuthStack;
