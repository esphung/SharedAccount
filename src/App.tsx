import useDevMenu from "@presentation/hooks/useDevMenu";
import RootStack from "@presentation/navigators/RootStack/RootStack";
import React from "react";
import { LogBox } from "react-native";
import type { ToastProps } from "react-native-toast-message";
import Toast from "react-native-toast-message";
import AppProviders from "@domain/providers/AppProviders";

if (__DEV__) {
	LogBox.ignoreAllLogs();
	// ignore: Sending `onAnimatedValueUpdate` with no listeners registered.
}

const toastProps: ToastProps = {
	type: "info",
	position: "top",
	bottomOffset: 100,
	onPress: () => Toast.hide(),
	autoHide: false,
	avoidKeyboard: true,
	swipeable: true,
	topOffset: 64,
};

export default function App() {
	useDevMenu();

	return (
		<>
			<AppProviders>
				<RootStack />
			</AppProviders>
			<Toast {...toastProps} />
		</>
	);
}
