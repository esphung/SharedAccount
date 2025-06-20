import ExpenseForm from "@components/ExpenseForm/ExpenseForm";

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

const renderInsideKeyboardProvider = (Story: React.FC) => (
	<KeyboardProvider>
		<Story />
	</KeyboardProvider>
);

const meta = {
	title: "ExpenseForm",
	component: ExpenseForm,
	args: {
		onSubmit: (_data: { amount: number; category: string; date: Date }) => {},
	},
	decorators: [
		(Story: React.FC) => (
			<View style={styles.container}>{renderInsideKeyboardProvider(Story)}</View>
		),
	],
} satisfies Meta<typeof ExpenseForm>;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
	},
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onSubmit: (_data: { amount: number; category: string; date: Date }) => {},
	},
};
