import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const meta = {
  title: "ExpenseForm",
  component: ExpenseForm,
  args: {
    onSubmit: (data: { amount: number; category: string; date: Date }) => {
      console.debug({ data });
    },
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ExpenseForm>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
