import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { trans } from "@utils/localization";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const SplashScreen = () => {
	return (
		<SharedAccountScreen {...generateTestIDs("splash-screen")} style={styles.container}>
			<SharedAccountText
				{...generateTestIDs("splash-screen-label", "text")}
				type="listHeader"
			>
				{trans("SplashScreen.title")}
			</SharedAccountText>
			<ActivityIndicator
				{...generateTestIDs("splash-screen-activity-indicator")}
				size="large"
				color={colors.primary}
			/>
		</SharedAccountScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: colors.white,
		flex: 1,
		gap: 40,
		justifyContent: "center",
	},
});

export default SplashScreen;
