import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import { DateTime } from "luxon";
import React from "react";
import type { ViewStyle } from "react-native";
import { View } from "react-native";
import type { DateTimePickerProps } from "react-native-modal-datetime-picker";
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

const DateTimePicker = React.forwardRef<
  DateTimePickerModal,
  {
    selectedDate: Date;
    onChangeDate?: (date: Date) => void;
    containerStyle?: ViewStyle;
    isDatePickerVisible: boolean;
    onDatePickerVisibilityChange: (isVisible: boolean) => void;
  } & Omit<DateTimePickerProps, "date" | "onConfirm" | "onCancel">
>(
  (
    {
      selectedDate,
      onChangeDate,
      containerStyle,
      isDatePickerVisible: isDatePickerVisibleProp,
      onDatePickerVisibilityChange: onDatePickerVisibilityChangeProp,
      ...rest
    },
    ref,
  ) => {
    // const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const onConfirmCallback = React.useCallback((date: Date) => {
      // setDatePickerVisible(false);
      onDatePickerVisibilityChangeProp(false);
      onChangeDate?.(date);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={containerStyle}>
        <SharedAccountButton
          type="secondary"
          onPress={() => onDatePickerVisibilityChangeProp(true)}
          title={
            selectedDate
              ? `${DateTime.fromJSDate(selectedDate).toFormat("cccc, LLL dd, yyyy")} ${getHumanDateStr(selectedDate)}`.trim()
              : "Select Date"
          }
        />
        <DateTimePickerModal
          ref={ref}
          date={selectedDate}
          isVisible={isDatePickerVisibleProp}
          mode="date"
          onConfirm={onConfirmCallback}
          onCancel={() => onDatePickerVisibilityChangeProp(false)}
          {...rest}
        />

        {/* {listMemoized} */}
      </View>
    );
  },
);

export default DateTimePicker;
