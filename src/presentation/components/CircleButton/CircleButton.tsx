import colors from "@config/themes/colors";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React from "react";
import type { GestureResponderEvent, TouchableOpacityProps, ViewStyle } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type CircleButtonProps = {
	onPress: (event: GestureResponderEvent) => void;
	children?: React.ReactNode;
	containerStyle?: ViewStyle;
} & TouchableOpacityProps;

const CIRCLE_BUTTON_SIZE = 64;

const CircleButton = ({
	onPress,
	children,
	containerStyle,
	disabled,
	...rest
}: CircleButtonProps) => {
	return (
		<TouchableOpacity
			disabled={!!disabled}
			{...generateTestIDs("circle-button", "button")}
			onPress={onPress}
			style={StyleSheet.flatten([styles.container, containerStyle])}
			activeOpacity={0.8}
			{...rest}
		>
			<View style={[styles.circle, disabled && styles.disabled]}>{children}</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	circle: {
		alignItems: "center",
		backgroundColor: colors.primary,
		borderRadius: CIRCLE_BUTTON_SIZE / 2,
		elevation: 8,
		height: CIRCLE_BUTTON_SIZE,
		justifyContent: "center",
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		width: CIRCLE_BUTTON_SIZE,
	},
	container: {
		alignSelf: "center",
		bottom: 20, // You may need to tweak this depending on your tab bar height
		position: "absolute",
		zIndex: 10,
	},
	disabled: {
		opacity: 0.6,
	},
});

export default CircleButton;
