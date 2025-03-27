import colors from "@config/themes/colors";
import MoneyFunctions from "@utils/MoneyFunctions";
import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const getMinimumValue = (data: { value: number; dataPointText: string }[]) => {
  return Math.min(...data.map((item) => Math.min(item.value)));
};

const getMaximumValue = (data: { value: number; dataPointText: string }[]) => {
  return Math.max(...data.map((item) => Math.max(item.value)));
};

const CustomLineChart = ({
  lineData,
  lineData2,
}: {
  lineData: { pos: number; value: number; dataPointText: string }[];
  lineData2: { pos: number; value: number; dataPointText: string }[];
}) => {
  const { width } = useWindowDimensions();
  return (
    <LineChart
      data={lineData}
      data2={lineData2}
      showVerticalLines
      spacing={width / 36}
      color1={colors.red}
      color2={colors.green}
      textColor1={colors.dark}
      textColor2={colors.dark}
      dataPointsHeight={10}
      dataPointsWidth={10}
      textShiftY={-10}
      dataPointsColor1={colors.red}
      dataPointsColor2={colors.green}
      noOfSections={1}
      noOfVerticalLines={lineData.length}
      xAxisLabelsHeight={StyleSheet.hairlineWidth}
      yAxisLabelTexts={[
        `${MoneyFunctions.formatMoney(getMinimumValue([...lineData, ...lineData2]), 0)}`,
        `${MoneyFunctions.formatMoney(getMaximumValue([...lineData, ...lineData2]), 0)}`,
      ]}
      xAxisLabelTexts={lineData.map((_, index) => `${index + 1}`)}
      xAxisLabelTextStyle={styles.xAxisLabel}
      yAxisTextStyle={styles.yAxisText}
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

export default CustomLineChart;
