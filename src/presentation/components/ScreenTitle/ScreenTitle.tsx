import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { padding } from "@presentation/constants/layout";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ScreenTitleProps = {
	title: string;
	subtitle?: string;
	onPressRightSide?: () => void;
};

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, subtitle, onPressRightSide }) => {
	return (
		<View {...generateTestIDs("screen-title-container")} style={styles.row}>
			<View style={styles.container}>
				<View style={styles.leftSide}>
					<SharedAccountText
						{...generateTestIDs("screen-title-text", "text")}
						type="screenHeader"
					>
						{title}
					</SharedAccountText>
				</View>
				{subtitle && (
					<TouchableOpacity
						{...generateTestIDs("screen-subtitle-btn-container", "button")}
						onPress={onPressRightSide}
						style={styles.rightSide}
					>
						<SharedAccountText
							{...generateTestIDs("screen-subtitle-text", "text")}
							style={styles.textAlignSubtitle}
						>
							{subtitle}
						</SharedAccountText>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flexDirection: "row",
		height: 80,
		justifyContent: "space-between",
		paddingLeft: padding.screen.horizontal.xSmall,
		paddingRight: padding.screen.horizontal.small,
		paddingVertical: padding.screen.vertical.xSmall,
		width: "100%",
	},
	leftSide: {
		alignItems: "flex-start",
		justifyContent: "center",
		paddingLeft: padding.screen.horizontal.xSmall,
	},
	rightSide: {
		alignItems: "flex-end",
		justifyContent: "center",
		paddingRight: padding.screen.horizontal.xSmall,
	},
	row: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
	},
	textAlignSubtitle: {
		textAlign: "right", // Right align the subtitle text
	},
});

export default ScreenTitle;

ScreenTitle.displayName = "ScreenTitle";
