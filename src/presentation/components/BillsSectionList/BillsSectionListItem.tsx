import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import type { ScheduledTransaction } from "@data/models/types/ScheduledTransaction";
import MoneyFunctions from "@utils/MoneyFunctions";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function BillsSectionListItem({
  item,
  isPast,
  isSameMonth,
  onPress,
}: {
  item: ScheduledTransaction;
  isPast: boolean;
  isSameMonth: boolean;
  onPress?: (id: string) => void;
}) {
  const memoizedUpdateColorStyle = React.useMemo(() => {
    return StyleSheet.flatten([isPast && styles.pastAmount, !isPast && isSameMonth && styles.incomingAmount]);
  }, [isPast, isSameMonth]);
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress?.(item.id)}>
      <View>
        <SharedAccountText style={StyleSheet.flatten([styles.billName, memoizedUpdateColorStyle])}>
          {item.name}
        </SharedAccountText>
        <SharedAccountText style={StyleSheet.flatten([styles.category, memoizedUpdateColorStyle])}>
          {item.category}
        </SharedAccountText>
      </View>
      <View>
        <SharedAccountText style={StyleSheet.flatten([styles.amount, memoizedUpdateColorStyle])}>
          {item.type === "credit" ? "+" : "-"}
          {MoneyFunctions.formatMoney(item.amount)}
        </SharedAccountText>
        <SharedAccountText style={StyleSheet.flatten([styles.dueDate, memoizedUpdateColorStyle])}>
          {__DEV__
            ? DateTime.fromJSDate(item.startDate).toFormat("MMM d h:mm a")
            : DateTime.fromJSDate(item.startDate).toFormat("MMM d")}
        </SharedAccountText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: "bold", // Default color
    textAlign: "right",
  },
  billName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    color: colors.dark,
    fontSize: 14,
  },
  dueDate: {
    color: colors.dark,
    fontSize: 14,
    textAlign: "right",
  },
  incomingAmount: {
    color: colors.warning,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  pastAmount: {
    color: colors.success,
    opacity: 0.5,
    textDecorationLine: "line-through",
  },
});
