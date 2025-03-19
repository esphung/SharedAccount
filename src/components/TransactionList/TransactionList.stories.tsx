import TransactionList from "@components/TransactionList/TransactionList";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const meta = {
  title: "TransactionList",
  component: TransactionList,
  args: {},
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TransactionList>;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
