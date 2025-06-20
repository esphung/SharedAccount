import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { setAuth0Token, useStore } from "@stores/zustand/useStore";

type ScreenTitleProps = { title: string; subtitle?: string };

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, subtitle }) => {
	const { clearSession, clearCredentials } = useAuth0();

	// Store accessor to set the token in Zustand store
	const setToken = useStore(setAuth0Token);

	const handleSignOut = useCallback(async () => {
		try {
			await clearCredentials();
			await clearSession({ federated: true });
			// Clear the token in Zustand store
			setToken(null);
			console.info("[ScreenTitle] User signed out successfully");
		} catch (error) {
			console.error("[ScreenTitle] Error signing out:", error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{__DEV__ && <Button title="Sign Out" onPress={handleSignOut} />}
			<View {...generateTestIDs("screen-title-container")} style={styles.row}>
				<View style={styles.container}>
					<SharedAccountText
						{...generateTestIDs("screen-title-text", "text")}
						type="screenHeader"
					>
						{title}
					</SharedAccountText>
				</View>
				<View {...generateTestIDs("screen-subtitle-container")} style={styles.container}>
					<SharedAccountText
						{...generateTestIDs("screen-subtitle-text", "text")}
						type="listItemSubtitle"
					>
						{subtitle}
					</SharedAccountText>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	row: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
	},
});

export default ScreenTitle;

ScreenTitle.displayName = "ScreenTitle";
