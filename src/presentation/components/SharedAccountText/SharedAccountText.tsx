import colors from "@config/themes/colors";
import { useTheme } from "@react-navigation/native";
import React from "react";
import type { TextProps, TextStyle } from "react-native";
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, Text } from "react-native";

type SharedAccountTextProps = {
	type?: keyof typeof styles;
	style?: TextProps["style"];
} & TextProps;

const fontWeightMap: Record<keyof typeof styles, "regular" | "bold" | "heavy" | "medium"> = {
	buttonTitle: "bold",
	expenseFormError: "regular",
	expenseFormLabel: "bold",
	finePrint: "regular",
	link: "medium",
	listHeader: "bold",
	listItemSubtitle: "regular",
	listItemTitle: "bold",
	listSectionHeader: "bold",
	primary: "regular",
	screenHeader: "bold",
	secondaryButtonTitle: "bold",
	tabBarLabel: "regular",
	transactionType: "heavy",
};

export default function SharedAccountText(props: SharedAccountTextProps) {
	const { children, style, type, ...rest } = props;

	const { colors } = useTheme();

	const memoizedStyles: TextStyle = React.useMemo(
		() =>
			StyleSheet.flatten([
				{ fontWeight: fontWeightMap[type || "primary"] },
				styles[type || "primary"],
				{ color: colors.text },
				style,
			]),
		[type, colors, style]
	);

	return (
		<Text style={memoizedStyles} {...rest}>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	// eslint-disable-next-line react-native/no-unused-styles
	buttonTitle: {
		color: colors.light,
		fontSize: 16,
		textAlign: "center",
	},
	// eslint-disable-next-line react-native/no-unused-styles
	expenseFormError: {
		color: colors.danger,
		fontSize: 14,
		textAlign: "center",
	},
	// eslint-disable-next-line react-native/no-unused-styles
	expenseFormLabel: {
		fontSize: 16,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	finePrint: {
		color: colors.secondary,
		fontSize: 12,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	link: {
		// blue color for links
		color: colors.primary,
		fontSize: 16,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	listHeader: {
		fontSize: 18,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	listItemSubtitle: {
		fontSize: 16,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	listItemTitle: {
		fontSize: 18,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	listSectionHeader: {
		fontSize: 16,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	primary: {
		fontSize: 16,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	screenHeader: {
		fontSize: 28,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	secondaryButtonTitle: {
		color: colors.dark,
		fontSize: 16,
		textAlign: "center",
	},
	// eslint-disable-next-line react-native/no-unused-styles
	tabBarLabel: {
		fontSize: 12,
	},
	// eslint-disable-next-line react-native/no-unused-styles
	transactionType: {
		fontSize: 20,
	},
});
