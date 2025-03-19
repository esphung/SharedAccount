import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@themes/colors";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Money } from "ts-money";
import type { RecurringExpense } from "types/RecurringExpense";

// Function to format money - takes an amount in cents and returns a formatted string
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(new Money(amount, "USD").getAmount() / 100);
};

export default function UpcomingBillsSectionListItem({
  item,
  isPast,
}: {
  item: RecurringExpense;
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
          {/* ${item.amount.toFixed(2)} */}
          {/* {new Money(item.amount, "USD").getAmount() / 100} */}
          {formatMoney(item.amount)}
        </SharedAccountText>
        <SharedAccountText style={styles.dueDate}>
          {DateTime.fromJSDate(item.startDate).toFormat("LLL d")}
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
