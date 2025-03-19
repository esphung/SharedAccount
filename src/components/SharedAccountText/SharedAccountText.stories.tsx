import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const meta = {
  title: "SharedAccountText",
  component: SharedAccountText,
  args: {
    children: "Shared Budget",
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SharedAccountText>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  btnTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgb(46, 52, 54)",
    borderRadius: 8,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const ScreenHeader: Story = {
  args: {
    type: "screenHeader",
  },
};

export const ListHeader: Story = {
  args: {
    type: "listHeader",
    children: "Recent Transactions",
  },
};

export const ListItemTitle: Story = {
  args: {
    type: "listItemTitle",
    children: "Jack",
  },
};

export const ListItemSubtitle: Story = {
  args: {
    type: "listItemSubtitle",
    children: "You paid $100 for groceries",
  },
};

export const ButtonTitle: Story = {
  args: {
    type: "buttonTitle",
    children: "Add an expense",
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.btnTitleContainer}>
        <Story />
      </View>
    ),
  ],
};
