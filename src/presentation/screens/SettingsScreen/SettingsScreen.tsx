import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import { selectAuth0SetToken } from "@domain/stores/zustand/actions";
import { padding } from "@presentation/constants/layout";
import { useCallback } from "react";
import type { AlertButton } from "react-native";
import { Alert, Button, StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useStore } from "@domain/stores/zustand/useStore";
import type { AppTabsParamList, AppTabsScreens } from "@navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { trans } from "@utils/localization";

type SettingsScreenProps = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Settings>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
	const { clearSession, clearCredentials } = useAuth0();

	const setToken = useStore(selectAuth0SetToken);

	const openAsyncPrompt = useCallback((message: string, buttons: AlertButton[]) => {
		return new Promise<boolean>((resolve) => {
			Alert.alert("Confirm Action", message, buttons, {
				cancelable: true,
				onDismiss: () => resolve(false), // Resolve with false if dismissed
			});
			// Resolve with true if the user confirms the action
			buttons.forEach((button) => {
				if (button.onPress) {
					button.onPress = () => resolve(true);
				}
			});
		});
	}, []);

	const handleSignOut = useCallback(
		() =>
			openAsyncPrompt("Are you sure you want to sign out?", [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Sign Out",
					onPress: async () => {
						try {
							await clearSession({ federated: true });
							await clearCredentials();
							setToken(null);
							console.info("[ScreenTitle] User signed out successfully");
						} catch (error) {
							console.error("[ScreenTitle] Error signing out:", error);
						}
					},
				},
			]),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<SharedAccountScreen>
			<ScreenTitle title="Settings" />
			<View style={styles.fill}>
				<Button
					title={trans("SettingsScreen.goBack")}
					onPress={() => navigation.goBack()}
				/>
			</View>

			<View style={styles.footerContainer}>
				<Button title={trans("SettingsScreen.signOut")} onPress={handleSignOut} />
			</View>
		</SharedAccountScreen>
	);
};

const styles = StyleSheet.create({
	fill: {
		flex: 1,
	},
	footerContainer: {
		padding: padding.screen.vertical.large,
		paddingBottom: 100,
	},
});

export default SettingsScreen;
