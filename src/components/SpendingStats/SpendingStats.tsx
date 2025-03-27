import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { DateTime } from "luxon";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { Transaction } from "types/Transaction";
import StatsRow from "./StatsRow";

import colors from "@config/themes/colors";
import MoneyFunctions from "@utils/MoneyFunctions";
import CustomLineChart from "./CustomLineChart";
import GroupedBarChart from "./GroupedBarChart";

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

  const renderTopLabelComponent = (value: number) => (
    <SharedAccountText style={styles.label}>
      {Math.round(
        Number(MoneyFunctions.formatMoney(Number(value)).replace("$", "")),
      )}
    </SharedAccountText>
  );

  const chartData: {
    stacks: {
      value: number;
      color: string;
    }[];
  }[] = React.useMemo(() => {
    const temp = Array.from({ length: 30 }, (_, i) => i + 1);
    // zip the two arrays together
    const zipped = temp.map((item, index) => {
      const expenseAmount = expenseTransactionsRange[index] || 0;
      const creditAmount = creditTransactionsRange[index] || 0;
      const stacks = [
        {
          value: expenseAmount,
          color: colors.red,
        },
        {
          value: creditAmount,
          color: colors.green,
        },
      ];
      if (creditAmount > expenseAmount) {
        stacks.reverse();
      }
      return {
        stacks,
        topLabelComponent: () =>
          renderTopLabelComponent(
            creditAmount > expenseAmount ? creditAmount : expenseAmount,
          ),
      };
    });

    return zipped;
  }, [creditTransactionsRange, expenseTransactionsRange]);

  const lineChartData: {
    lineData: { pos: number; value: number; dataPointText: string }[];
    lineData2: { pos: number; value: number; dataPointText: string }[];
  } = React.useMemo(() => {
    const lineData = [
      ...expenseTransactionsRange.map((value, index) => ({
        pos: index,
        value,
        dataPointText:
          value > 0 ? `${MoneyFunctions.formatMoney(value, 0)}` : "",
      })),
    ];

    const lineData2 = [
      ...creditTransactionsRange.map((value, index) => ({
        pos: index,
        value,
        dataPointText:
          value > 0 ? `${MoneyFunctions.formatMoney(value, 0)}` : "",
      })),
    ];
    return { lineData, lineData2 };
  }, [creditTransactionsRange, expenseTransactionsRange]);

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
      <View style={styles.graphsContainer}>
        <View style={styles.northPanel}>
          <GroupedBarChart data={chartData} />
        </View>
        <View style={styles.southPanel}>
          <CustomLineChart {...lineChartData} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  graphsContainer: {
    flex: 1,
    gap: 8,
    marginVertical: 8,
  },
  label: {
    color: colors.dark,
    fontSize: 4,
    textAlign: "center",
    top: -4,
  },
  northPanel: {
    flex: 1,
  },
  southPanel: {
    flex: 1,
  },
});

export default SpendingStats;
