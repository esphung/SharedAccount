import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { useTheme } from "@react-navigation/native";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React from "react";
import type { TouchableOpacityProps, ViewStyle } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

type SharedAccountButtonProps = {
	title: string;
} & TouchableOpacityProps;

const baseStyle: ViewStyle = {
	borderRadius: 8,
	height: 48,
	justifyContent: "center",
	paddingHorizontal: 16,
	paddingVertical: 8,
};

export default function SharedAccountButton(props: SharedAccountButtonProps) {
	const { title, style, disabled, ...rest } = props;

	const theme = useTheme();

	return (
		<TouchableOpacity
			{...generateTestIDs("sharedAccountButton", "button")}
			disabled={disabled}
			style={[
				baseStyle,
				theme.dark
					? {
							...styles.secondary,
							borderColor: colors.primary,
							backgroundColor: colors.primary,
						}
					: {
							...styles.primary,
							borderColor: colors.dark,
							backgroundColor: colors.dark,
						},
				disabled ? styles.disabled : {},
				style,
				disabled && styles.disabled,
			]}
			{...rest}
		>
			<SharedAccountText
				style={[
					styles.text,
					{
						fontWeight: theme.fonts.heavy.fontWeight,
						fontFamily: theme.fonts.heavy.fontFamily,
					},
					{ color: colors.white },
					disabled && styles.disabled,
				]}
			>
				{title}
			</SharedAccountText>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	disabled: {
		opacity: 0.5,
	},
	primary: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		height: 48,
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	secondary: {
		borderColor: colors.secondary,
		borderRadius: 8,
		borderWidth: StyleSheet.hairlineWidth,
		height: 48,
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	suggestionItem: {
		alignItems: "flex-start",
		borderColor: colors.secondary,
		borderRadius: 8,
		borderWidth: StyleSheet.hairlineWidth,
		marginVertical: 4,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	suggestionItemText: {
		color: colors.dark,
	},
	text: {
		fontSize: 16,
		textAlign: "center",
	},
});
