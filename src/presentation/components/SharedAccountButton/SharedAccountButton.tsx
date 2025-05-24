import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import React from "react";
import type {TouchableOpacityProps} from "react-native";
import {StyleSheet, TouchableOpacity} from "react-native";

type ButtonStyleKeys = keyof typeof styles;

type ButtonTextStyleKey = `${string}Text`;

type ExcludeExtraStyles = Exclude<ButtonStyleKeys, "disabled" | ButtonTextStyleKey>;

type SharedAccountButtonProps = {
	title: string;
	type?: ExcludeExtraStyles;
} & TouchableOpacityProps;

export default function SharedAccountButton(props: SharedAccountButtonProps) {
	const {title, type = "primary", style, disabled, ...rest} = props;

	const memoizedStyle = React.useMemo(() => {
		const typeStyle = {
			borderColor: colors.transparent,
			...styles[type],
		};
		return StyleSheet.flatten([typeStyle, style, disabled && styles.disabled]);
	}, [type, disabled, style]);

	return (
		<TouchableOpacity
			testID="sharedAccountButton"
			disabled={disabled}
			style={memoizedStyle}
			activeOpacity={0.7}
			{...rest}>
			<SharedAccountText
				type={type === "secondary" ? "secondaryButtonTitle" : "buttonTitle"}
				style={StyleSheet.flatten([
					disabled && styles.disabledText,
					// @ts-expect-error - type is a string
					styles[`${type}Text` as ButtonTextStyleKey],
				])}>
				{title}
			</SharedAccountText>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	disabled: {
		backgroundColor: colors.disabled,
		opacity: 0.4,
	},
	disabledText: {
		color: colors.white,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	primary: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		height: 48,
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	// eslint-disable-next-line react-native/no-unused-styles
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
});
