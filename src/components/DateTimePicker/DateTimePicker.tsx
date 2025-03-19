import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import { DateTime } from "luxon";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateTimePicker = ({
  initialDate = DateTime.now().toJSDate(),
  onChangeDate,
}: {
  initialDate: Date;
  onChangeDate?: (date: number) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const humanDayLabelText = React.useMemo(() => {
    // return "Today" if the date is today
    if (DateTime.fromJSDate(selectedDate).hasSame(DateTime.now(), "day")) {
      return "Today";
    }
    // return "Tomorrow" if the date is tomorrow
    else if (
      DateTime.fromJSDate(selectedDate).hasSame(
        DateTime.now().plus({ days: 1 }),
        "day",
      )
    ) {
      return "Tomorrow";
    }
    // return the day of the week if the date is within the next week
    else if (
      DateTime.fromJSDate(selectedDate).hasSame(DateTime.now(), "week")
    ) {
      return DateTime.fromJSDate(selectedDate).toFormat("cccc");
    }
    // return the date if the date is more than a week away
    return DateTime.fromJSDate(selectedDate).toFormat("cccc, LLL dd, yyyy");
  }, [selectedDate]);

  return (
    <>
      <SharedAccountButton
        onPress={() => setDatePickerVisible(true)}
        title={selectedDate ? humanDayLabelText : "Select Date"}
      />
      <DateTimePickerModal
        date={selectedDate}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setSelectedDate(date);
          setDatePickerVisible(false);

          // convert to millis
          const millis = date.getTime();
          onChangeDate?.(millis);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />

      {/* {listMemoized} */}
    </>
  );
};

export default DateTimePicker;
