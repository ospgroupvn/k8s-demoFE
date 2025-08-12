"use client";

import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "../ui/chart";

// const chartData = [
//   { label: "HN", value: 100, fill: "red" },
//   { label: "HCM", value: 120, fill: "blue" },
// ];

interface ChartConfigItem {
  [X: string]: {
    label: string;
    color: string;
  };
}

const chartColors = [
  "#3CC3DF",
  "#FFAE4C",
  "#537FF1",
  "#6FD195",
  "#8979FF",
  "#FF928A",
];

interface Props {
  label: string;
  data: {
    name: string;
    value: string[];
  }[];
  minHeight?: number;
  labelFormat?: "value" | "percent" | "all";
}

const DashboardCharts = ({
  label,
  data,
  minHeight = 400,
  labelFormat = "value",
}: Props) => {
  const chartData = useMemo(() => {
    const newData = data
      ?.filter((item) => item.value && Number(item.value?.[1]) > 0)
      ?.map((item, index) => {
        return {
          label: item.name,
          value: Number(item.value?.[1] || "0"),
          percent: Number(item.value?.[0] || "0"),
          fill: chartColors[index],
        };
      });

    return newData;
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfigItem = {};

    data
      ?.filter((item) => item.value && Number(item.value?.[1]) > 0)
      ?.forEach((item, index) => {
        config[item.name] = {
          label: item.name,
          color: chartColors[index],
        };
      });

    return config satisfies ChartConfig;
  }, [data]);

  const renderCustomizedLabel = ({
    payload,
    cx,
    cy,
    x,
    y,
    textAnchor,
    dominantBaseline,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    startAngle,
    endAngle,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const diffAngle = endAngle - startAngle;
    const delta = (360 - diffAngle) / 50 - 1;
    const radius = innerRadius + (outerRadius - innerRadius);

    const newX = cx + (radius + delta) * Math.cos(-midAngle * RADIAN);
    const newY = cy + (radius + delta * delta) * Math.sin(-midAngle * RADIAN);

    if (payload.percent < 10) {
      return (
        <text
          x={newX}
          y={newY}
          fill={payload.fill}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontWeight="normal"
        >
          {labelFormat === "value"
            ? value
            : labelFormat === "percent"
            ? `${payload.percent}%`
            : `${value} (${payload.percent}%)`}
        </text>
      );
    }

    return (
      <text
        cx={cx}
        cy={cy}
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fill={payload.fill}
      >
        {labelFormat === "value"
          ? value
          : labelFormat === "percent"
          ? `${payload.percent}%`
          : `${value} (${payload.percent}%)`}
      </text>
    );
  };

  const renderCustomizedLabelLine = (props: any) => {
    const {
      payload,
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
    } = props;
    const RADIAN = Math.PI / 180;
    const diffAngle = endAngle - startAngle;
    const radius = innerRadius + (outerRadius - innerRadius);
    let path = "";
    for (let i = 0; i < (360 - diffAngle) / 50 - 1; i++) {
      path += `${cx + (radius + i) * Math.cos(-midAngle * RADIAN)},${
        cy + (radius + i * i) * Math.sin(-midAngle * RADIAN)
      } `;
    }

    if (payload.percent < 5) {
      return <polyline points={path} stroke={payload.fill} fill="none" />;
    }

    return <></>;
  };

  const customToolTip = (props: any) => {
    return (
      <div className="bg-white border-black border text-black p-4 flex items-center justify-center">
        <strong className="mr-1">{props.payload?.[0]?.name}: </strong>{" "}
        {props.payload?.[0]?.value}
      </div>
    );
  };

  return (
    <div className="gap-2 flex max-sm:flex-col min-w-0 max-w-full flex-wrap">
      <div className="basis-0 grow flex flex-col items-center justify-end bg-white shadow-lg py-2 min-w-0 max-w-full">
        <h1 className="my-4 rounded-sm text-center w-full font-bold px-2 min-w-0">
          {label}
        </h1>

        {chartData?.length ? (
          // <div className="min-w-0">
          (<ChartContainer
            config={chartConfig}
            className="min-w-0 max-w-full min-h-[300px]"
            style={{ minHeight: minHeight }}
          >
            <PieChart margin={{ top: 30, bottom: 30 }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                label={renderCustomizedLabel}
                labelLine={renderCustomizedLabelLine}
                legendType="circle"
                minAngle={1}
                paddingAngle={1}
              />
              <ChartTooltip content={(props) => customToolTip(props)} />
              <ChartLegend
                content={<ChartLegendContent nameKey="label" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 mt-4"
              />
            </PieChart>
          </ChartContainer>)
        ) : (
          <div className="h-[300px] flex justify-center items-center">
            <Loader2 className="animate-spin text-default-blue" height={24} />
          </div>
        )}
      </div>
      {/* <div className="basis-0 grow flex flex-col items-center bg-white rounded-xl shadow-lg py-2 min-w-0 max-w-full">
        <h1 className="my-4 rounded-sm text-center w-full font-bold px-2">
          Mức độ phân bố tổ chức đấu giá tài sản tại các Tỉnh/Thành phố
        </h1>

        {dgtsChartData?.length ? (
          <ChartContainer
            config={dgtsConfig}
            className="min-h-[300px] min-w-0 max-w-full"
          >
            <PieChart>
              <Pie
                data={dgtsChartData}
                dataKey="value"
                nameKey="label"
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsla(var(--foreground))"
                    >{`${payload.value} (${payload.percentage}%)`}</text>
                  );
                }}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="label" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 mt-4"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex justify-center items-center">
            <Loader2 className="animate-spin text-default-blue" height={24} />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default DashboardCharts;
