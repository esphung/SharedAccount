import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import colors from "@config/themes/colors";
import { selectAuth0Token, setAuth0Token, useStore } from "@stores/zustand/useStore";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import PKG_JSON from "./../../../../package.json";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";

const LoginScreen = () => {
	const { authorize, user, getCredentials, clearCredentials, clearSession } = useAuth0();
	const token = useStore(selectAuth0Token);
	const setToken = useStore(setAuth0Token);

	const onLogoutCallback = useCallback(async () => {
		try {
			await clearCredentials();
			await clearSession();
			// Clear the token in Zustand store
			console.info("[LoginView] User logged out");
		} catch (error) {
			console.error("[LoginView] Error during logout:", error);
		}

		setToken(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onLoginCallback = useCallback(async () => {
		try {
			const credentials = await authorize({
				scope: "openid profile email",
				audience: "auth", // Replace with your API audience
			});
			if (credentials?.accessToken) {
				setToken(credentials.accessToken);
			}
		} catch (error) {
			console.error("[LoginView] Error during login:", error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Fetch token when user changes or when the component mounts
		const fetchToken = async () => {
			if (user) {
				console.info("[LoginView] User is logged in:", user);
				try {
					const credentials = await getCredentials();
					setToken(credentials?.accessToken ? credentials.accessToken : null);
				} catch (error) {
					console.error("[LoginView] Error fetching credentials:", error);
				}
			} else {
				setToken(null);
			}
		};

		fetchToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<SharedAccountScreen {...generateTestIDs("login-screen")} style={styles.fill}>
			<View style={styles.northPanel}>
				<SharedAccountText
					{...generateTestIDs("package-version-label", "text")}
					type="listSectionHeader"
				>
					Version: {PKG_JSON.version}
				</SharedAccountText>
			</View>
			<View style={styles.centerPanel}>
				<SharedAccountText
					{...generateTestIDs("login-screen-title", "text")}
					type="screenHeader"
				>
					{token ? "Welcome back!" : "Please log in"}
				</SharedAccountText>
				<SharedAccountText
					{...generateTestIDs("login-screen-subtitle", "text")}
					type="listSectionHeader"
				>
					{token ? `Logged in as ${user?.name}` : "You need to log in to continue."}
				</SharedAccountText>
			</View>
			<View style={styles.southPanel}>
				<SharedAccountButton
					{...generateTestIDs("login-button")}
					style={styles.btn}
					onPress={token ? onLogoutCallback : onLoginCallback}
					title={token ? "Log out" : "Log in"}
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
