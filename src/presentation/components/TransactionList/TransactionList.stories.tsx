import TransactionList from "@components/TransactionList/TransactionList";
import LocalDatabaseBuilder from "@data/models/builders/LocalDatabaseBuilder";

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const mockLocalDatabase = new LocalDatabaseBuilder().build();
const { transactions, users } = mockLocalDatabase;

const meta = {
  title: "TransactionList",
  component: TransactionList,
  argTypes: {
    transactions: {
      control: {
        type: "object",
      },
    },
    users: {
      control: {
        type: "object",
      },
    },
  },
  args: {
    transactions,
    users,
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
    transactions,
    users,
    onPress: () => {},
  },
};
