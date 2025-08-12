"use client";

import { BAR_CHART_COLORS } from "@/constants/common";
import { BarChartData } from "@/types/common";
import { ReportItem } from "@/types/congChung";
import { useCallback, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface Props {
  data: ReportItem[]; // Dữ liệu đầu vào
  defaultColumns: {
    // Danh sách các tiêu chí
    index: number;
    label: string;
  }[];
  activeColumns: string[]; // Các tiêu chí hiện tại
  groupByProvince?: boolean; // Nhóm theo tỉnh thành
}

const CommonBarChart = ({
  data,
  defaultColumns,
  activeColumns,
  groupByProvince = false,
}: Props) => {
  const [highlightedBrowser, setHighlightedBrowser] = useState<string | null>(
    null
  );

  // Chart data mặc định
  const chartDataDefault = useCallback(() => {
    const indexArr = activeColumns?.length
      ? activeColumns
      : [...Array(defaultColumns.length).keys()];
    const newChartData: BarChartData[] = [];

    // Setup label
    indexArr?.forEach((item) => {
      const index = defaultColumns.findIndex(
        (sItem) => sItem.index.toString() === item
      );

      if (index !== -1) {
        const currentStatus = defaultColumns[index];
        const newData: BarChartData = { label: currentStatus.label };

        // Dữ liệu API trả về có dạng {col_1: "Hà Nội", col_2: "123", ...}
        // returnData[0][1] sẽ trả về tên tỉnh thành
        // returnData[index][1] sẽ trả về giá trị của cột có index hiện tại
        // sau khi map thì dữ liệu sẽ có dạng {"Hà Nội": "123", ...}
        data?.forEach((qItem, qIndex) => {
          const returnData = Object.entries(qItem);

          if (
            returnData?.[0]?.length &&
            returnData?.[currentStatus.index - 1]?.length &&
            qIndex > 0
          ) {
            newData[returnData[0][1]] = Number(
              returnData[currentStatus.index - 1][1]
            );
          }
        });

        newChartData.push(newData);
      }
    });

    return newChartData || [];
  }, [activeColumns, data, defaultColumns]);

  // chart data khi lấy dữ liệu cả nước
  // gọi khi activeColumns có 1 cột hoặc groupByProvince = true
  const chartDataByProvince = useCallback(() => {
    const newChartData: BarChartData[] = [];

    data?.forEach((item, index) => {
      if (index > 0) {
        const entries = Object.entries(item);
        const currentItem: BarChartData = { label: item.col_1 };

        entries.forEach((eItem, eIndex) => {
          if (activeColumns?.includes((eIndex + 1).toString())) {
            const currentColumn = defaultColumns.find(
              (cItem) => cItem.index === eIndex + 1
            );

            if (currentColumn?.label) {
              currentItem[currentColumn?.label] = Number(eItem[1]);
            }
          }
        });

        newChartData.push(currentItem);
      }
    });

    return newChartData;
  }, [activeColumns, data, defaultColumns]);

  const chartData = useMemo(() => {
    return activeColumns?.length === 1 || groupByProvince
      ? chartDataByProvince()
      : chartDataDefault();
  }, [
    activeColumns?.length,
    groupByProvince,
    chartDataByProvince,
    chartDataDefault,
  ]);

  const chartConfig = () => {
    const config: ChartConfig = {};

    if (!groupByProvince && activeColumns?.length > 1) {
      data?.forEach((item, index) => {
        if (index > 0) {
          if (activeColumns?.length > 1 && !groupByProvince) {
            config[item.col_1] = {
              label: item.col_1,
              color: BAR_CHART_COLORS[index % BAR_CHART_COLORS.length],
            };
          }
        }
      });
    } else {
      activeColumns?.forEach((item, index) => {
        const currentColumn = defaultColumns.find(
          (cItem) => cItem.index === Number(item)
        );

        if (currentColumn) {
          config[currentColumn.label] = {
            label: currentColumn.label,
            color: BAR_CHART_COLORS[index % BAR_CHART_COLORS.length],
          };
        }
      });
    }

    return config;
  };

  return (
    <ChartContainer
      config={chartConfig()}
      className="min-h-[300px] max-h-[500px] min-w-full"
      {...(groupByProvince
        ? {
            style: {
              width: chartData?.length * 20 * activeColumns?.length,
              // width:
              //   activeColumns?.length === 1
              //     ? chartData?.length * 40
              //     : chartData?.length * 20 * activeColumns?.length,
            },
          }
        : {})}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 10,
          bottom: 50,
          ...(groupByProvince ? { right: 100 } : {}),
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          interval={0}
          dataKey="label"
          tickFormatter={(value) => {
            if (value.length > 30) {
              return `${value.substring(0, 30)}...`;
            }

            return value;
          }}
          {...(activeColumns?.length === 1 || groupByProvince
            ? {
                angle: -45,
                textAnchor: "end",
              }
            : {})}
        />
        <YAxis domain={[0, "dataMax + 5"]} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        {Object.keys(chartConfig()).map((key) => (
          <Bar
            // barSize={activeColumns?.length === 1 ? 20 : 10}
            barSize={10}
            key={key}
            dataKey={key}
            fill={chartConfig()[key].color}
            opacity={
              highlightedBrowser ? (highlightedBrowser === key ? 1 : 0.3) : 1
            }
          />
        ))}

        <Legend
          {...(groupByProvince || activeColumns?.length === 1
            ? { wrapperStyle: { paddingTop: 80 } }
            : {})}
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span
              style={{
                color: "var(--foreground)",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHighlightedBrowser(value)}
              onMouseLeave={() => setHighlightedBrowser(null)}
            >
              {chartConfig()[value].label}
            </span>
          )}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default CommonBarChart;
