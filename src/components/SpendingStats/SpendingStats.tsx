import LocalDatabaseBuilder from "@builders/LocalDatabaseBuilder";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import MoneyFunctions from "@helpers/MoneyFunctions";
import colors from "@themes/colors";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-svg-charts";

const mockLocalDatabase = new LocalDatabaseBuilder().build();
const { transactions: spendingData } = mockLocalDatabase;

// const spendingData = [
//   new TransactionBuilder("expense")
//     .setCategory("Food")
//     .setAmount(100000)
//     .build(),
//   new TransactionBuilder("expense")
//     .setCategory("Shopping")
//     .setAmount(200000)
//     .build(),
//   new TransactionBuilder("expense")
//     .setCategory("Travel")
//     .setAmount(150000)
//     .build(),
//   new TransactionBuilder("expense")
//     .setCategory("Entertainment")
//     .setAmount(50000)
//     .build(),
//   new TransactionBuilder("expense")
//     .setCategory("Others")
//     .setAmount(100000)
//     .build(),
// ];

const SpendingStats = () => {
  const totalLast30Days = spendingData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalThisMonth = 600000;

  return (
    <View style={styles.container}>
      {/* Last 30 Days Section */}
      <SharedAccountText style={styles.title}>Last 30 days</SharedAccountText>
      <SharedAccountText style={styles.amount}>
        {MoneyFunctions.formatMoney(totalLast30Days)}
      </SharedAccountText>

      <FlatList
        data={spendingData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.barContainer}>
            <SharedAccountText style={styles.category}>
              {item.category}
            </SharedAccountText>
            <View
              style={[
                styles.bar,
                { width: `${(item.amount / totalLast30Days) * 500}%` },
              ]}
            />
          </View>
        )}
      />

      {/* This Month Section */}
      <SharedAccountText style={styles.title}>This month</SharedAccountText>
      <SharedAccountText style={styles.amount}>
        {MoneyFunctions.formatMoney(totalThisMonth)}
      </SharedAccountText>

      {/* Bar Chart */}
      <BarChart
        // horizontal
        style={styles.chart}
        data={spendingData.map((item) => {
          return item.amount;
        })}
        svg={{ fill: colors.secondary }}
        contentInset={{ top: 10, bottom: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  amount: {
    color: colors.dark,
    fontSize: 28,
    fontWeight: "bold",
  },
  bar: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 20,
    marginHorizontal: 10,
  },
  barContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 8,
  },
  category: {
    color: colors.primary,
    fontSize: 14,
    width: 100,
  },
  chart: {
    height: 150,
    marginTop: 20,
  },
  container: {
    height: "100%",
  },
  title: {
    color: colors.dark,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
});

export default SpendingStats;
