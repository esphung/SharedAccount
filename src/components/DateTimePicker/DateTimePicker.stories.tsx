import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

const RenderItem = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
  return (
    <DateTimePicker
      selectedDate={selectedDate}
      onChangeDate={setSelectedDate}
      isDatePickerVisible={isDatePickerVisible}
      onDatePickerVisibilityChange={setDatePickerVisible}
    />
  );
};

const meta = {
  title: "DateTimePicker",
  component: DateTimePicker,
  decorators: [
    (Story: React.FC) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof DateTimePicker>;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDate: new Date(),
    isDatePickerVisible: false,
    onDatePickerVisibilityChange: () => {},
  },
  render: RenderItem,
};
