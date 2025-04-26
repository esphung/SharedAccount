import BillsSectionList from "@components/BillsSectionList/BillsSectionList";
import LocalDatabaseBuilder from "@data/models/builders/LocalDatabaseBuilder";

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const mockLocalDatabase = new LocalDatabaseBuilder().build();
const { scheduledTransactions } = mockLocalDatabase;

const meta = {
  title: "BillsSectionList",
  component: BillsSectionList,
  argTypes: {
    scheduledTransactions: {
      control: {
        type: "object",
      },
    },
    onPress: {
      action: "onPress",
    },
    onPressAddNew: {
      action: "onPressAddNew",
    },
  },
  args: {
    scheduledTransactions,
    onPress: (_: string) => {},
    onPressAddNew: () => {},
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BillsSectionList>;

const styles = StyleSheet.create({
  container: {},
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scheduledTransactions,
    onPress: (_: string) => {},
    onPressAddNew: () => {},
  },
};
