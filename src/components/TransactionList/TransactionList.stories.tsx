import CreditBuilder from "@builders/CreditBuilder";
import ExpenseBuilder from "@builders/ExpenseBuilder";
import UserBuilder from "@builders/UserBuilder";
import TransactionList from "@components/TransactionList/TransactionList";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { Credit } from "types/Credit";
import type { Expense } from "types/Expense";
import type { User } from "types/User";

// Sample Data
const users: User[] = [
  new UserBuilder().build(),
  new UserBuilder().setEmail("bob@gmail.com").build(),
];

const expenses: Expense[] = [
  ...Array.from({ length: 10 }, (_) =>
    new ExpenseBuilder()
      .setUserId(faker.helpers.arrayElement(users).id)
      .setDate(faker.date.past())
      .build(),
  ),
];

const credits: Credit[] = [
  ...Array.from({ length: 10 }, (_) =>
    new CreditBuilder()
      .setUserId(faker.helpers.arrayElement(users).id)
      .setDate(faker.date.past())
      .build(),
  ),
];

const transactions: (Credit | Expense)[] = [...expenses, ...credits];

const meta = {
  title: "TransactionList",
  component: TransactionList,
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
  container: {
    // padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
