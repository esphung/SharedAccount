import React from "react";
import { StyleSheet } from "react-native";
import { Grid, LineChart } from "react-native-svg-charts";

type Props = {
  lineChartData: {
    data: number[];
    svg: { stroke: string };
  }[];
};

const CustomLineChart = (props: Props) => {
  const { lineChartData = [] } = props;

  return (
    <LineChart
      style={styles.lineChart}
      data={lineChartData}
      contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid
      // direction={Grid.Direction.HORIZONTAL}
      // svg={{
      //   stroke: colors.dark,
      //   strokeWidth: StyleSheet.hairlineWidth,
      // }}
      />
    </LineChart>
  );
};

const styles = StyleSheet.create({
  lineChart: {
    height: 200,
  },
});

export default CustomLineChart;
