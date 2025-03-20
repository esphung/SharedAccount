import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import MoneyFunctions from "../../utils/MoneyFunctions";
import colors from "@config/themes/colors";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { Transaction } from "types/Transaction";
import BarChartHorizontalWithLabels from "./BarChartHorizontalWithLabels";

const SpendingStats = ({
  transactions = [],
}: {
  transactions: Transaction[];
}) => {
  const totalThisMonth = React.useCallback(
    (type: "credit" | "expense") => {
      const lastEndOfMonth = DateTime.now().endOf("month");
      return transactions
        .filter((item) => item.type === type)
        .filter(
          (item) =>
            item.date.getTime() >=
              DateTime.now().startOf("month").toJSDate().getTime() &&
            item.date.getTime() < lastEndOfMonth.toJSDate().getTime(),
        )
        .reduce((sum, item) => sum + item.amount, 0);
    },
    [transactions],
  );

  const processedBarChartData = React.useCallback(
    (type: "expense" | "credit") => {
      const list: {
        date: Date;
        amount: number;
        type: "credit" | "expense";
      }[] = [];

      // last number of day of the month
      const firstDay = DateTime.now().startOf("month").day;
      const lastDay = DateTime.now().endOf("month").day;

      // fill the list with 0.0 amount for each day
      for (let i = firstDay; i < lastDay; i++) {
        const averageForDay = transactions
          .filter(
            (transaction) =>
              DateTime.fromJSDate(transaction.date).day === i &&
              transaction.type === type,
          )
          .reduce((sum, transaction) => sum + transaction.amount, 0); // sum of all transactions for the day

        list.push({
          // date: DateTime.now().minus({ days: i }).toJSDate(),
          date: DateTime.now().set({ day: i }).toJSDate(),
          amount: averageForDay,
          type,
        });
      }

      const sorted = list
        .filter(
          (item) =>
            item.date.getTime() >=
            new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
        )
        .filter((item) => item.type === type);
      // group by days from current date's month
      const grouped = sorted.reduce(
        (acc, item) => {
          const date = DateTime.fromJSDate(item.date);
          const day = date.day;
          if (acc[day]) {
            acc[day] += item.amount;
          } else {
            acc[day] = item.amount;
          }
          return acc;
        },
        {} as Record<number, number>,
      );
      // convert to array
      const result = Object.keys(grouped).map((key) => ({
        date: DateTime.now()
          .set({ day: parseInt(key, 10) })
          .toJSDate(),
        amount: grouped[parseInt(key, 10)],
      }));
      return result;
    },
    [transactions],
  );

  const memoizedCreditData = React.useMemo(
    () => processedBarChartData("credit"),
    [processedBarChartData],
  );

  const memoizedExpenseData = React.useMemo(
    () => processedBarChartData("expense"),
    [processedBarChartData],
  );

  return (
    <View style={styles.container}>
      <SharedAccountText type="screenHeader">
        {DateTime.now().toFormat("MMMM yyyy")}
      </SharedAccountText>
      <View style={styles.northPanel}>
        <SharedAccountText type="listHeader" style={styles.greenText}>
          Deposited {MoneyFunctions.formatMoney(totalThisMonth("credit"))}
        </SharedAccountText>
        {/* <BarChartHorizontalWithLabels data={memoizedCreditData} /> */}
        <BarChartHorizontalWithLabels data={memoizedCreditData} />
      </View>
      <View style={styles.southPanel}>
        <SharedAccountText type="listHeader" style={styles.greenText}>
          Spent {MoneyFunctions.formatMoney(totalThisMonth("expense"))}
        </SharedAccountText>
        <BarChartHorizontalWithLabels data={memoizedExpenseData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greenText: {
    color: colors.green,
  },
  northPanel: {
    flexShrink: 1,
    marginTop: 20,
  },
  southPanel: {
    flexShrink: 1,
    marginTop: 20,
  },
});

export default SpendingStats;
