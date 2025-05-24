import colors from "@config/themes/colors";
import {StyleSheet} from "react-native";

export default StyleSheet.create({
	buttonBar: {
		alignItems: "center",
		bottom: 20,
		flexDirection: "row",
		justifyContent: "space-evenly",
		left: 0,
		position: "absolute",
		right: 0,
		zIndex: 100,
	},
	circularBtnStyle: {
		borderRadius: 40,
		elevation: 8,
		padding: 20,
		shadowColor: colors.softGray,
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
});
