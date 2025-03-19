import RecurringExpenseBuilder from "@builders/RecurringExpenseBuilder";
import UpcomingBillsSectionList from "@components/UpcomingBillsSectionList/UpcomingBillsSectionList";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { RecurringExpense } from "types/RecurringExpense";

// Sample recurring expenses with some past dates
const recurringExpenses: RecurringExpense[] = [
  new RecurringExpenseBuilder()
    .setId("1")
    .setSharedAccountId("1") // 🔹 Add this field for account linking
    .setName("Rent")
    .setAmount(120010)
    .setCategory("Housing")
    .setStartDate(new Date(2025, 2, 1)) // March 1, 2025 (Past)
    .setRepeatInterval("monthly")
    .build(),
  new RecurringExpenseBuilder()
    .setId("2")
    .setSharedAccountId("2") // 🔹 Add this field for account linking
    .setName("Electricity")
    .setCategory("Utilities")
    .setStartDate(new Date(2025, 3, 5)) // April 5, 2025 (Future)
    .setRepeatInterval("monthly")
    .build(),
  new RecurringExpenseBuilder()
    .setId("3")
    .setSharedAccountId("3")
    .setName("Internet")
    .setCategory("Utilities")
    .setStartDate(new Date(2025, 1, 10)) // February 10, 2025 (Past)
    .setRepeatInterval("monthly")
    .build(),
  new RecurringExpenseBuilder()
    .setId("4")
    .setSharedAccountId("4")
    .setName("Car Loan")
    .setCategory("Loans")
    .setStartDate(new Date(2025, 4, 1)) // May 1, 2025 (Future)
    .setRepeatInterval("monthly")
    .setEndDate(new Date(2026, 4, 1))
    .build(),
  new RecurringExpenseBuilder()
    .setId("5")
    .setSharedAccountId("5")
    .setName("Spotify")
    .setCategory("Entertainment")
    .setStartDate(new Date(2025, 3, 5)) // April 5, 2025 (Future)
    .setRepeatInterval("monthly")
    .build(),
];

const meta = {
  title: "UpcomingBillsSectionList",
  component: UpcomingBillsSectionList,
  args: {
    recurringExpenses,
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof UpcomingBillsSectionList>;

const styles = StyleSheet.create({
  container: {},
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
