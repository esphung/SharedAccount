import LocalDatabaseBuilder from "@builders/LocalDatabaseBuilder";
import SpendingStats from "@components/SpendingStats/SpendingStats";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const mockLocalDatabase = new LocalDatabaseBuilder().build();
const { transactions } = mockLocalDatabase;

const meta = {
  title: "SpendingStats",
  component: SpendingStats,
  argTypes: {
    transactions: {
      control: {
        type: "object",
      },
    },
  },
  args: {
    transactions,
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SpendingStats>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    transactions: [...transactions],
  },
};

export const NoTransactions: Story = {
  args: {
    transactions: [],
  },
};
