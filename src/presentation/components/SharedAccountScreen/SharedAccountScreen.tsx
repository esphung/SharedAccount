import React from "react";
import type { ViewProps } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";

type SharedAccountScreenProps = ViewProps & { children?: React.ReactNode };

export default function SharedAccountScreen(props: SharedAccountScreenProps) {
	const { children, style, ...rest } = props;
	return (
		<SafeAreaView style={StyleSheet.flatten([styles.container, style])} {...rest}>
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
