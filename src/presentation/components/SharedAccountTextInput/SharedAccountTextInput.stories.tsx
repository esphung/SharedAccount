import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import type {Meta, StoryObj} from "@storybook/react";
import React from "react";
import {StyleSheet, View} from "react-native";

const meta = {
	title: "SharedAccountTextInput",
	component: SharedAccountTextInput,
	args: {},
	decorators: [
		(Story: React.FC) => (
			<View style={styles.container}>
				<Story />
			</View>
		),
	],
} satisfies Meta<typeof SharedAccountTextInput>;

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
