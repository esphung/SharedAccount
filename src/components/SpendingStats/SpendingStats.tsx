import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import {
  GroupedBarChartAdapter,
  LineChartAdapter,
} from "@data/adapters/ChartAdapters";
import { DateTime } from "luxon";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import type { Transaction } from "types/Transaction";
import CustomLineChart from "./CustomLineChart";
import GroupedBarChart from "./GroupedBarChart";
import StatsRow from "./StatsRow";

const calculateMonthlyTotoal = (
  type: "credit" | "expense",
  arr: Transaction[],
) => {
  const lastEndOfMonth = DateTime.now().endOf("month");
  return arr
    .filter((item) => item.type === type)
    .filter(
      (item) =>
        item.date.getTime() >=
          DateTime.now().startOf("month").toJSDate().getTime() &&
        item.date.getTime() < lastEndOfMonth.toJSDate().getTime(),
    )
    .reduce((sum, item) => sum + item.amount, 0);
};

const mapTransactionsToRange = (
  transactions: Transaction[],
  type: "credit" | "expense",
) => {
  const filtered = transactions.filter((item) => item.type === type);
  const range = Array.from({ length: 30 }, (_, i) => i + 1);
  return range.map((day) => {
    return filtered
      .filter((item) => {
        const date = DateTime.fromJSDate(item.date);
        return (
          date.day === day &&
          date.month === DateTime.now().month &&
          date.year === DateTime.now().year
        );
      })
      .reduce((sum, item) => sum + item.amount, 0);
  });
};

const SpendingStats = ({
  transactions = [],
}: {
  transactions: Transaction[];
}) => {
  const expenseTransactionsRange = React.useMemo(
    () => mapTransactionsToRange(transactions, "expense"),
    [transactions],
  );

  const creditTransactionsRange = React.useMemo(() => {
    return mapTransactionsToRange(transactions, "credit");
  }, [transactions]);

  const barChartData = [
    ...GroupedBarChartAdapter.mapTuplesToChartList([
      [creditTransactionsRange, colors.green],
      [expenseTransactionsRange, colors.red],
      // __DEV__
      //   ? [
      //       // 30 days of random data
      //       [
      //         1400, 100, 20000, 9500, -9400, -2400, -800, 8500, -9100, 3500,
      //         -5300, 5300, -7800, 6600, 9600, 3300, -2600, -3200, 7300, 800,
      //         1400, -100, 100, -9500, -9400, -24, -800, 8500, -9100, 3500,
      //       ],
      //       // Array.from({ length: 30 }, () => 30000),
      //       colors.dark,
      //     ]
      //   : [[], colors.dark],
    ]),
  ];

  const lineChartData = [
    ...LineChartAdapter.mapTuplesToChartList([
      [creditTransactionsRange, colors.green],
      [expenseTransactionsRange, colors.red],
      // __DEV__
      //   ? [
      //       // 30 days of random data
      //       [
      //         1400, 100, 20000, 9500, -9400, -2400, -800, 8500, -9100, 3500,
      //         -5300, 5300, -7800, 6600, 9600, 3300, -2600, -3200, 7300, 800,
      //         1400, -100, 100, -9500, -9400, -24, -800, 8500, -9100, 3500,
      //       ],
      //       // Array.from({ length: 30 }, () => 30000),
      //       colors.dark,
      //     ]
      //   : [[], colors.dark],
    ]),
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SharedAccountText type="screenHeader">
        {DateTime.now().toFormat("MMMM yyyy")}
      </SharedAccountText>
      <StatsRow
        amount={calculateMonthlyTotoal("credit", transactions)}
        type="credit"
      />
      <StatsRow
        amount={calculateMonthlyTotoal("expense", transactions)}
        type="expense"
      />
      <GroupedBarChart
        // barChartData={groupedBarChartArr}
        barChartData={barChartData}
      />
      <CustomLineChart
        lineChartData={lineChartData}
        // lineChartData={lineChartArray}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default SpendingStats;
