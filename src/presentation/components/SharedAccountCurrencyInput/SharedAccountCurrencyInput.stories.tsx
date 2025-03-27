import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const meta = {
  title: "SharedAccountCurrencyInput",
  component: SharedAccountCurrencyInput,
  args: {
    value: 100,
    onChangeValue: (val: number) => console.debug("[SharedAccountCurrencyInput]", val),
  },
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SharedAccountCurrencyInput>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 100,
    onChangeValue: (val: number) => console.debug("[SharedAccountCurrencyInput:Default]", val),
  },
};
