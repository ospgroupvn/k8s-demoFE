"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Legend, Pie, PieChart } from "recharts";

export const HomepagePieChart = () => {
  const chartConfig = {
    active: {
      label: "Đang hoạt động",
      color: "#22C55E",
    },
    suspend: {
      label: "Tạm đình chỉ",
      color: "#818181",
    },
    cancel: {
      label: "Bãi bỏ",
      color: "#EF4444",
    },
  } satisfies ChartConfig;

  const chartData = [
    { status: "active", value: 15000, fill: "var(--color-active)" },
    { status: "suspend", value: 5000, fill: "var(--color-suspend)" },
    { status: "cancel", value: 2000, fill: "var(--color-cancel)" },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Tổng quan Trạng thái Hành nghề</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              stroke="0"
              innerRadius={60}
              paddingAngle={1}
            />
            <Legend
              align="center"
              formatter={(value) => {
                const itemConfig =
                  chartConfig[value as keyof typeof chartConfig];
                return itemConfig ? itemConfig.label : value;
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
