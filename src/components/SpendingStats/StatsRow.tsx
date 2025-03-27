import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import MoneyFunctions from "../../utils/MoneyFunctions";

export default function StatsRow({
  amount,
  type,
}: {
  amount: number;
  type: "credit" | "expense";
}) {
  return (
    <View style={styles.row}>
      {type === "credit" ? (
        <SharedAccountText type="listHeader" style={styles.greenText}>
          Income
        </SharedAccountText>
      ) : (
        <SharedAccountText type="listHeader" style={styles.redText}>
          Expenses
        </SharedAccountText>
      )}
      <SharedAccountText>
        {type === "credit" ? "+" : "-"}
        {MoneyFunctions.formatMoney(amount)}
      </SharedAccountText>
    </View>
  );
}

const styles = StyleSheet.create({
  greenText: {
    color: colors.green,
  },
  redText: {
    color: colors.red,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    padding: 10,
  },
});
