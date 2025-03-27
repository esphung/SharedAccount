import MoneyFunctions from "@utils/MoneyFunctions";
import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const getMinimumValue = (data: { stacks: { value: number }[] }[]) => {
  return Math.min(...data.map((item) => Math.min(...item.stacks.map((stack) => stack.value))));
};

const getMaximumValue = (data: { stacks: { value: number }[] }[]) => {
  return Math.max(...data.map((item) => Math.max(...item.stacks.map((stack) => stack.value))));
};

const GroupedBarChart = ({
  data,
}: {
  data: {
    stacks: (
      | {
          value: number;
          color: string;
        }
      | {
          value: number;
          color: string;
        }
    )[];
  }[];
}) => {
  const { width } = useWindowDimensions();
  return (
    <BarChart
      stackData={data}
      barWidth={width / 38}
      spacing={0.1}
      noOfSections={1}
      yAxisLabelTexts={[
        `${MoneyFunctions.formatMoney(getMinimumValue(data), 0)}`,
        `${MoneyFunctions.formatMoney(getMaximumValue(data), 0)}`,
      ]}
      xAxisLabelTextStyle={styles.xAxisLabel}
      yAxisTextStyle={styles.yAxisText}
      xAxisLabelsHeight={StyleSheet.hairlineWidth}
      xAxisLabelTexts={data.map((_, index) => `${index + 1}`)}
      onPress={(item: {
        stacks: {
          value: number;
          color: string;
        }[];
      }) => console.debug({ item: JSON.stringify(item, null, 2) })}
    />
  );
};

const styles = StyleSheet.create({
  xAxisLabel: {
    fontSize: 6,
  },
  yAxisText: {
    fontSize: 10,
  },
});

export default GroupedBarChart;
