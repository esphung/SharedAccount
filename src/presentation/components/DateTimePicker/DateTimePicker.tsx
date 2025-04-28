import ClockSvgIcon from "@assets/svg/clock-svgrepo-com.svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { DateTime } from "luxon";
import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { DateTimePickerProps } from "react-native-modal-datetime-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const getHumanDateTimeStr = (date: Date): string => {
  // format the date to a human-readable string
  const dateTime = DateTime.fromJSDate(date);
  const dateStr = dateTime.toFormat("cccc, LLL dd, yyyy");
  const timeStr = dateTime.toFormat("hh:mm a");
  return `${dateStr} ${timeStr}`;
};

const DateTimePicker = React.forwardRef<
  DateTimePickerModal,
  {
    selectedDate: Date;
    onChangeDate?: (date: Date) => void;
    containerStyle?: ViewStyle;
    isDatePickerVisible: boolean;
    onDatePickerVisibilityChange: (isVisible: boolean) => void;
  } & Omit<DateTimePickerProps, "date" | "onConfirm" | "onCancel" | "isVisible">
>(
  (
    {
      selectedDate,
      onChangeDate,
      containerStyle,
      isDatePickerVisible: isDatePickerVisibleProp,
      onDatePickerVisibilityChange: onDatePickerVisibilityChangeProp,
    },
    ref,
  ) => {
    const onConfirmCallback = React.useCallback((date: Date) => {
      // setDatePickerVisible(false);
      onDatePickerVisibilityChangeProp(false);
      onChangeDate?.(date);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={containerStyle}>
        <TouchableOpacity
          style={styles.button}
          // type="secondary"
          onPress={() => onDatePickerVisibilityChangeProp(true)}
          // title={selectedDate ? `${getHumanDateTimeStr(selectedDate)}`.trim() : "Select Date"}
        >
          <ClockSvgIcon width={20} height={20} />
          <SharedAccountText>
            {selectedDate ? `${getHumanDateTimeStr(selectedDate)}`.trim() : "Select Date"}
          </SharedAccountText>
        </TouchableOpacity>

        <DateTimePickerModal
          ref={ref}
          date={selectedDate}
          isVisible={isDatePickerVisibleProp}
          onConfirm={onConfirmCallback}
          onCancel={() => onDatePickerVisibilityChangeProp(false)}
          mode="datetime"
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.softGray,
    borderRadius: 5,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    padding: 10,
  },
});

export default DateTimePicker;
