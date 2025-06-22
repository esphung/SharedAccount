import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import type { ViewProps } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";

type SharedAccountScreenProps = ViewProps & { children?: React.ReactNode };

export default function SharedAccountScreen(props: SharedAccountScreenProps) {
	const { children, style, ...rest } = props;

	const theme = useTheme();

	const themedStyle = useMemo(
		() => [
			styles.container,
			{
				backgroundColor: theme.colors.background,
			},
			style,
		],
		[theme, style]
	);

	return (
		<SafeAreaView style={themedStyle} {...rest}>
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
