import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import MoneyFunctions from "../../utils/MoneyFunctions";
import colors from "@config/themes/colors";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { ScheduledTransaction } from "types/ScheduledTransaction";

export default function UpcomingBillsSectionListItem({
  item,
  isPast,
}: {
  item: ScheduledTransaction;
  isPast: boolean;
}) {
  return (
    <View style={styles.item}>
      <View>
        <SharedAccountText style={styles.billName}>
          {item.name}
        </SharedAccountText>
        <SharedAccountText style={styles.category}>
          {item.category}
        </SharedAccountText>
      </View>
      <View>
        <SharedAccountText style={[styles.amount, isPast && styles.pastAmount]}>
          {item.type === "credit" ? "+" : "-"}
          {MoneyFunctions.formatMoney(item.amount)}
        </SharedAccountText>
        <SharedAccountText style={styles.dueDate}>
          {DateTime.fromJSDate(item.startDate).toFormat("MMM d")}
        </SharedAccountText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: "bold", // Default color
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pastAmount: {
    color: colors.green, // Green color if the date has passed
  },
});
