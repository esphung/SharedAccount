import colors from "@config/themes/colors";
import { padding } from "@presentation/constants/layout";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	btn: {
		marginBottom: padding.screen.vertical.large,
		width: "80%",
	},
	centerPanel: {
		alignItems: "center",
		flex: 1,
		gap: 10,
		justifyContent: "center",
	},
	fill: {
		flex: 1,
	},
	northPanel: {
		alignItems: "center",
		gap: 10,
		height: padding.northPanel.height,
		justifyContent: "center",
		width: "100%",
	},
	southPanel: {
		alignItems: "center",
		height: padding.southPanel.height,
		justifyContent: "center",
		paddingTop: padding.screen.vertical.large,
		width: "100%",
	},
	spinnerBackdrop: {
		alignItems: "center",
		backgroundColor: colors.whiteTransparent,
		bottom: 0,
		justifyContent: "center",
		left: 0,
		position: "absolute",
		right: 0,
		top: 0,
		zIndex: 1000, // Ensure the loading indicator is on top
	},
});

export { styles };
