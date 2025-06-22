import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { selectAuth0SetToken } from "@domain/stores/zustand/actions";
import { selectAuth0Token, selectSetUserId } from "@domain/stores/zustand/selectors";
import { styles } from "@presentation/screens/LoginScreen/LoginScreen.style";
import { useStore } from "@stores/zustand/useStore";
import { trans } from "@utils/localization";
import { capitalizeFirstLetter } from "@utils/stringFunctions";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback, useEffect, useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, Button, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import Toast from "react-native-toast-message";
import PKG_JSON from "./../../../../package.json";

const LoginScreen = () => {
	const { authorize, user: auth0User, clearCredentials, clearSession } = useAuth0();

	// store
	const token = useStore(selectAuth0Token);
	const setToken = useStore(selectAuth0SetToken);
	const setUserId = useStore(selectSetUserId);

	// state
	const [name, setName] = React.useState<string | null>(null);
	const [isLoggingInOrOut, setIsLoggingInOrOut] = React.useState<boolean>(false);

	const onLogoutCallback = useCallback(async () => {
		try {
			await Promise.all([
				clearCredentials(), // Clear Auth0 credentials
				clearSession({ federated: true }), // Clear Auth0 session
			]);
			// Reset the token in Zustand store
			setToken(null);
			console.info("[LoginView] User logged out");
		} catch (error) {
			console.error("[LoginView] Error during logout:", error);
		} finally {
			setIsLoggingInOrOut(false);
			setUserId(null); // Reset userId in Zustand store
			setName(null); // Reset name state
			Toast.show({
				type: "info",
				text1: "Logout Successful",
				text2: "You have successfully logged out.",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onLoginCallback = useCallback(async () => {
		try {
			if (isLoggingInOrOut) {
				console.warn("[LoginView] Already logging in or out, ignoring request.");
				return;
			}
			setIsLoggingInOrOut(true);
			// Clear previous credentials if any
			await clearCredentials();
			// Authorize the user
			console.info("[LoginView] Initiating login process...");
			const credentials = await authorize();
			if (credentials?.idToken) {
				setToken(credentials.idToken);
				setUserId(auth0User?.sub || null);
				setName(auth0User?.name || null);
			}
		} catch (error) {
			console.error("[LoginView] Error during login:", error);
			Toast.show({
				type: "error",
				text1: "Login Failed",
				text2: `${error instanceof Error ? error.message : "An unexpected error occurred."}`,
			});
		} finally {
			setIsLoggingInOrOut(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth0User?.name, auth0User?.sub, isLoggingInOrOut]);

	const onShowSuccessToast = useCallback(() => {
		Toast.show({
			type: "success",
			text1: "Login Successful",
			text2: `Welcome back${name ? `, ${name}` : ""}`.trim() + "!",
			autoHide: true,
			visibilityTime: 6500,
			onPress: () => Toast.hide(),
			avoidKeyboard: true,
			swipeable: true,
		});
	}, [name]);

	const spinnerStyles: StyleProp<ViewStyle> = useMemo(
		() => [{ display: isLoggingInOrOut ? "flex" : "none" }, styles.spinnerBackdrop],
		[isLoggingInOrOut]
	);

	useEffect(() => {
		if (token) {
			onShowSuccessToast();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SharedAccountScreen {...generateTestIDs("login-screen")}>
			<View style={styles.northPanel}>
				<SharedAccountText {...generateTestIDs("package-version-label", "text")}>
					{trans("LoginScreen.version")}: {PKG_JSON.version}
				</SharedAccountText>
				<SharedAccountText {...generateTestIDs("login-screen-env-label", "text")}>
					{process.env.APP_ENV
						? `${trans("LoginScreen.env")}: ${process.env.APP_ENV ? capitalizeFirstLetter(process.env.APP_ENV) : "Not Set"}`
						: `${trans("LoginScreen.env")}: APP_ENV is not set in the environment variables.`}
				</SharedAccountText>
				{PKG_JSON.debugLocalHost && (
					<SharedAccountText {...generateTestIDs("package-version-label", "text")}>
						{trans("LoginScreen.version")}: Debugging on localhost
					</SharedAccountText>
				)}
			</View>
			<View style={styles.centerPanel}>
				<SharedAccountText
					{...generateTestIDs("login-screen-title", "text")}
					type="listHeader"
				>
					{token ? trans("LoginScreen.welcomeBack") : trans("LoginScreen.pleaseLogIn")}
				</SharedAccountText>
				<SharedAccountText {...generateTestIDs("login-screen-subtitle", "text")}>
					{token ? `Logged in as ${auth0User?.name}` : "You need to log in to continue."}
				</SharedAccountText>
			</View>
			<View style={styles.southPanel}>
				<SharedAccountButton
					{...generateTestIDs("login-button")}
					style={styles.btn}
					onPress={token ? onLogoutCallback : onLoginCallback}
					title={token ? trans("LoginScreen.logout") : trans("LoginScreen.login")}
				/>
			</View>
			{__DEV__ && <Button title="Show Toast" onPress={onShowSuccessToast} />}
			<View style={spinnerStyles}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		</SharedAccountScreen>
	);
};

export default LoginScreen;
