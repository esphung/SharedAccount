---
to: src/presentation/components/<%= message %>/<%= message %>.stories.tsx
---
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";
import <%= message %> from "./<%= message %>";

const meta = {
  title: "<%= message %>",
  component: <%= message %>,
  argTypes: {},
  args: {},
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof <%= message %>>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
