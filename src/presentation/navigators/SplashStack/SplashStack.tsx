import { createStackNavigator } from "@react-navigation/stack";
import SplashScreenComponent from "@screens/SplashScreen/SplashScreen";

enum SplashStackScreens {
	SplashScreen = "SplashScreen",
}

export type SplashStackParamList = {
	[SplashStackScreens.SplashScreen]: undefined;
};

const Stack = createStackNavigator<SplashStackParamList>();

function SplashStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName={SplashStackScreens.SplashScreen}
		>
			<Stack.Screen
				name={SplashStackScreens.SplashScreen}
				component={SplashScreenComponent}
			/>
		</Stack.Navigator>
	);
}

export default SplashStack;
