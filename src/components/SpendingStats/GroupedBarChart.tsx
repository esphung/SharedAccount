import colors from "@config/themes/colors";
import React from "react";
import { StyleSheet } from "react-native";
import { BarChart, Grid } from "react-native-svg-charts";

type Props = {
  barChartData: {
    data: { value: number }[];
    svg: { fill: string };
  }[];
};

const GroupedBarChart = (props: Props) => {
  const { barChartData = [] } = props;
  const yAccessor = ({ item }: { item: { value: number } }) => {
    return item.value;
  };
  return (
    <BarChart
      style={styles.barChart}
      yAccessor={yAccessor}
      contentInset={{ top: 20, bottom: 20 }}
      // @ts-expect-error yAccessor is required
      data={barChartData}
    >
      <Grid
        direction={Grid.Direction.HORIZONTAL}
        svg={{
          stroke: colors.dark,
          strokeWidth: StyleSheet.hairlineWidth,
        }}
      />
    </BarChart>
  );
};

const styles = StyleSheet.create({
  barChart: {
    height: 200,
  },
});

export default GroupedBarChart;
