import TransactionList from "@components/TransactionList/TransactionList";
import LocalDatabaseBuilder from "@data/models/builders/LocalDatabaseBuilder";
import {groupTransactionsByDate} from "@screens/TransactionsScreen/TransactionsScreen";

import type {Meta, StoryObj} from "@storybook/react";
import React from "react";
import {StyleSheet, View} from "react-native";
import type {Transaction} from "types/Transaction";

const mockLocalDatabase = new LocalDatabaseBuilder().build();
const {transactions, users} = mockLocalDatabase;

const expenses = transactions.filter(
	(transaction): transaction is Transaction<"expense"> => transaction.type === "expense",
);
const credits = transactions.filter(
	(transaction): transaction is Transaction<"credit"> => transaction.type === "credit",
);
const data = groupTransactionsByDate(expenses, credits);

const meta = {
	title: "TransactionList",
	component: TransactionList,
	argTypes: {
		data: {
			control: {
				type: "object",
			},
		},
		users: {
			control: {
				type: "object",
			},
		},
		onPress: {
			action: "pressed",
		},
		isListReady: {
			control: {
				type: "boolean",
			},
		},
		onContentSizeChange: {
			action: "contentSizeChanged",
		},
	},
	args: {
		data,
		users,
		onPress: () => {},
		isListReady: true,
		onContentSizeChange: () => {},
	},
	decorators: [
		(Story: React.FC) => (
			<View style={styles.container}>
				<Story />
			</View>
		),
	],
} satisfies Meta<typeof TransactionList>;

const styles = StyleSheet.create({
	container: {},
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		data,
		users,
		onPress: () => {},
		isListReady: true,
		onContentSizeChange: () => {},
	},
};
