import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React from "react";
import { StyleSheet, View } from "react-native";

type ScreenTitleProps = { title: string; subtitle?: string };

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, subtitle }) => {
	return (
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
