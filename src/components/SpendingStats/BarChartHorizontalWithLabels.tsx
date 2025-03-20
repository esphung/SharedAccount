import MoneyFunctions from "../../utils/MoneyFunctions";
import colors from "@config/themes/colors";
import * as scale from "d3-scale";
import { DateTime } from "luxon";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Defs, LinearGradient, Stop, Text as SvgText } from "react-native-svg";
import { BarChart, Grid, XAxis } from "react-native-svg-charts";

type BarChartDayItem = {
  date: Date;
  amount: number;
};

const CUT_OFF = 50;

const Gradient = () => {
  return (
    <Defs key={"gradient"}>
      <LinearGradient id={"gradient"} x1={"0"} x2={"100%"} y2={"0%"}>
        <Stop offset={"0%"} stopColor={"rgb(134, 65, 244)"} />
        <Stop offset={"100%"} stopColor={"rgb(66, 194, 244)"} />
      </LinearGradient>
    </Defs>
  );
};

const generateSvg = (amount: number) => {
  if (amount <= 0) {
    return {
      stroke: colors.primary,
      strokeWidth: 0.5,
      fill: colors.transparent,
      strokeDasharray: [4, 2],
    };
  }
  return {
    stroke: colors.primary,
    fill: colors.primary,
    strokeWidth: 0.5,
  };
};

const getMaximumAmount = (data: BarChartDayItem[]) => {
  return Math.max(...data.map((item) => item.amount));
};

const Labels = ({
  x,
  y,
  bandwidth,
  arr: labelData,
}: {
  x: (value: number) => number;
  y: (value: number) => number;
  bandwidth: number;
  arr: {
    date: Date;
    amount: number;
    nil: boolean;
  }[];
}) => {
  const views = labelData.map((item, index) => {
    const { amount, nil } = item;
    const fill = CUT_OFF > amount || nil ? colors.dark : colors.light;
    if (nil) {
      return (
        <SvgText
          key={`label-${index}-${amount}`}
          x={x(index) + bandwidth / 2}
          y={y(0) + 5}
          fontSize={7}
          fill={fill}
          strokeWidth={0.5}
          alignmentBaseline="text-top"
          textAnchor="middle"
          stroke={colors.primary}
        >
          {MoneyFunctions.formatMoney(0).split(".")[0].replace("$", "")}
        </SvgText>
      );
    }
    return (
      <SvgText
        key={`label-${index}-${amount}`}
        x={x(index) + bandwidth / 2}
        y={CUT_OFF > amount ? y(amount) + 5 : y(amount) + 5}
        fontSize={7}
        fill={fill}
        strokeWidth={0.5}
        alignmentBaseline="text-top"
        textAnchor="middle"
        stroke={nil ? colors.primary : colors.light}
        strokeLinejoin="miter"
        strokeOpacity={0.5}
      >
        {nil
          ? MoneyFunctions.formatMoney(0).split(".")[0].replace("$", "")
          : MoneyFunctions.formatMoney(amount).split(".")[0].replace("$", "")}
      </SvgText>
    );
  });
  return <>{views}</>;
};

const getMinimumAmount = (data: BarChartDayItem[]) => {
  return Math.min(...data.map((item) => item.amount));
};

const BarChartHorizontalWithLabels = ({
  data,
}: {
  data: BarChartDayItem[];
}) => {
  const { min, max } = React.useMemo(() => {
    return { min: getMinimumAmount(data), max: getMaximumAmount(data) };
  }, [data]);

  const barChartItemsProcessed = React.useMemo(
    () =>
      data.map((item) => ({
        ...item,
        // amount: item.amount > min ? item.amount : max,
        amount: item.amount,
        svg: generateSvg(item.amount),
      })),
    [data],
  );

  return (
    <View style={styles.container}>
      <BarChart
        style={styles.gradientBarChart}
        data={barChartItemsProcessed}
        gridMin={min}
        gridMax={max}
        svg={{ fill: colors.primary }}
        yAccessor={({ item }) => item.amount}
        contentInset={{ top: 20, bottom: 20 }}
      >
        <Labels
          arr={data.map((item) => ({
            date: item.date,
            amount: item.amount > min ? item.amount : max,
            nil: item.amount <= min,
          }))}
          x={(value: number) => value}
          y={(value: number) => value}
          bandwidth={20}
        />

        <Grid />
        <Gradient />
      </BarChart>
      <XAxis
        data={data.map((item) => {
          return {
            date: item.date,
            amount: item.amount,
          };
        })}
        scale={scale.scaleBand}
        svg={{
          fontSize: 8,
          fill: colors.dark,
          stroke: colors.dark,
          strokeWidth: 0.5,
        }}
        formatLabel={(_, index) =>
          `${DateTime.fromJSDate(data[index].date).day}`
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  gradientBarChart: {
    height: 200,
  },
});

export default BarChartHorizontalWithLabels;
