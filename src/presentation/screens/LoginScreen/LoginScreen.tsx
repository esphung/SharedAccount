import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { selectAuth0SetToken } from "@domain/stores/zustand/actions";
import { selectAuth0Token } from "@domain/stores/zustand/selectors";
import type { BoundState } from "@stores/zustand/useStore";
import { useStore } from "@stores/zustand/useStore";
import { trans } from "@utils/localization";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import PKG_JSON from "./../../../../package.json";

const selectSetUserId = (state: BoundState) => state.user.setUserId;

const LoginScreen = () => {
	const {
		authorize,
		user: auth0User,
		// getCredentials,
		clearCredentials,
		clearSession,
	} = useAuth0();

	// store
	const token = useStore(selectAuth0Token);
	const setToken = useStore(selectAuth0SetToken);
	const setUserId = useStore(selectSetUserId);

	const onLogoutCallback = useCallback(async () => {
		try {
			await clearCredentials();
			await clearSession();
			// Clear the token in Zustand store
			console.info("[LoginView] User logged out");
		} catch (error) {
			console.error("[LoginView] Error during logout:", error);
		} finally {
			// Reset the token in Zustand store
			setToken(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onLoginCallback = useCallback(async () => {
		try {
			const credentials = await authorize();
			if (credentials?.idToken) {
				setToken(credentials.idToken);
				setUserId(auth0User?.sub || null);
			}
		} catch (error) {
			console.error("[LoginView] Error during login:", error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SharedAccountScreen {...generateTestIDs("login-screen")} style={styles.fill}>
			<View style={styles.northPanel}>
				<SharedAccountText {...generateTestIDs("package-version-label", "text")}>
					{trans("LoginScreen.version")}: {PKG_JSON.version}
				</SharedAccountText>
				<SharedAccountText {...generateTestIDs("login-screen-subtitle", "text")}>
					{token ? trans("LoginScreen.loggedIn") : trans("LoginScreen.notLoggedIn")}
				</SharedAccountText>
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
		</SharedAccountScreen>
	);
};

const styles = StyleSheet.create({
	btn: {
		marginBottom: 20,
		width: "80%",
	},
	centerPanel: {
		alignItems: "center",
		backgroundColor: colors.white,
		flex: 1,
		gap: 10,
		justifyContent: "center",
	},
	fill: {
		alignItems: "center",
		backgroundColor: colors.white,
		flex: 1,
	},
	northPanel: {
		alignItems: "center",
		backgroundColor: colors.white,
		gap: 10,
	},
	southPanel: {
		alignItems: "center",
		backgroundColor: colors.white,
		paddingBottom: 20,
		paddingTop: 20,
		width: "100%",
	},
});

export default LoginScreen;
