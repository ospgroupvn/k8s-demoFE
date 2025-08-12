import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface Props {
  data: {
    label: string;
    value: number;
  }[];
  lineLabel: string;
  lineColor?: string;
}

const LineChartReport = ({ data, lineLabel, lineColor = "#37b1cb" }: Props) => {
  const config = {
    value: {
      label: lineLabel,
      color: lineColor,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={config}
      className="min-h-[300px] max-h-[500px] min-w-full"
      style={{ width: 40 * 31 }}
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: -20,
          top: 20,
          right: 50,
          bottom: 50,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          angle={35}
          textAnchor="start"
          tickMargin={8}
          interval={0}
        />
        <YAxis domain={[0, "dataMax + 5"]} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Line
          dataKey="value"
          type="linear"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default LineChartReport;
