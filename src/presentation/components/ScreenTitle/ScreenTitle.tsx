import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { selectAuth0SetToken } from "@domain/stores/zustand/actions";
import { selectAuth0Token } from "@domain/stores/zustand/selectors";
import { useStore } from "@domain/stores/zustand/useStore";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";

type ScreenTitleProps = { title: string; subtitle?: string };

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, subtitle }) => {
	const { clearSession, clearCredentials } = useAuth0();

	const token = useStore(selectAuth0Token);
	const setToken = useStore(selectAuth0SetToken);

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
			<Button title="Sign Out" onPress={handleSignOut} disabled={!token} />
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
