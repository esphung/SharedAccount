import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { View, type ViewStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const getHumanDateStr = (date: Date): string => {
  const currentDate = DateTime.now();
  if (DateTime.fromJSDate(date).hasSame(currentDate, "day")) {
    // return "Today" if the date is today
    return "(Today)";
  }
  if (
    // return "Tomorrow" if the date is tomorrow
    DateTime.fromJSDate(date).hasSame(currentDate.plus({ days: 1 }), "day")
  ) {
    return "(Tomorrow)";
  }
  return "";
};

const DateTimePicker = ({
  selectedDate,
  onChangeDate,
  containerStyle,
}: {
  selectedDate: Date;
  onChangeDate?: (date: Date) => void;
  containerStyle?: ViewStyle;
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const onConfirmCallback = React.useCallback((date: Date) => {
    setDatePickerVisible(false);
    onChangeDate?.(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={containerStyle}>
      <SharedAccountButton
        type="secondary"
        onPress={() => setDatePickerVisible(true)}
        title={
          selectedDate
            ? `${DateTime.fromJSDate(selectedDate).toFormat("cccc, LLL dd, yyyy")} ${getHumanDateStr(selectedDate)}`.trim()
            : "Select Date"
        }
      />
      <DateTimePickerModal
        date={selectedDate}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={onConfirmCallback}
        onCancel={() => setDatePickerVisible(false)}
      />

      {/* {listMemoized} */}
    </View>
  );
};

export default DateTimePicker;
