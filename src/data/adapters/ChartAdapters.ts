// Data for the grouped bar chart
type GroupedBarChartItem = {
  data: { value: number }[];
  svg: { fill: string };
};

type LineChartItem = {
  data: number[];
  svg: { stroke: string };
};

type ChartDataAdapter<TOutput extends { data: unknown[] }> = {
  mapRangeToChartData: (range: number[]) => TOutput["data"];
  mapTuplesToChartList: (tuples: [number[], string][]) => TOutput[];
};

export const GroupedBarChartAdapter: ChartDataAdapter<GroupedBarChartItem> = {
  mapRangeToChartData: (range) => {
    return range.map((value) => ({ value: Math.abs(value) }));
  },
  mapTuplesToChartList: (tuples) => {
    return tuples.map(([range, color]) => ({
      data: GroupedBarChartAdapter.mapRangeToChartData(range),
      svg: { fill: color },
    }));
  },
};

export const LineChartAdapter: ChartDataAdapter<LineChartItem> = {
  mapRangeToChartData: (range) => range,
  mapTuplesToChartList: (tuples) => {
    return tuples.map(([range, color]) => ({
      data: LineChartAdapter.mapRangeToChartData(range),
      svg: { stroke: color },
    }));
  },
};
