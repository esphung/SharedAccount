import LocalDatabaseBuilder from "@builders/LocalDatabaseBuilder";
import UpcomingBillsSectionList from "@components/UpcomingBillsSectionList/UpcomingBillsSectionList";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const mockLocalDatabase = new LocalDatabaseBuilder().build();
const { scheduledTransactions } = mockLocalDatabase;

const meta = {
  title: "UpcomingBillsSectionList",
  component: UpcomingBillsSectionList,
  args: {
    scheduledTransactions,
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
