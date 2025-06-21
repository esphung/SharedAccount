import { createStackNavigator } from "@react-navigation/stack";
import LoginScreenComponent from "@screens/LoginScreen/LoginScreen";

enum AuthStackScreens {
	LoginScreen = "LoginScreen",
}

export type AuthStackParamList = {
	[AuthStackScreens.LoginScreen]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName={AuthStackScreens.LoginScreen}
		>
			<Stack.Screen name={AuthStackScreens.LoginScreen} component={LoginScreenComponent} />
		</Stack.Navigator>
	);
}

export default AuthStack;
