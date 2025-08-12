"use client";

import { BAR_CHART_COLORS } from "@/constants/common";
import { cn } from "@/lib/utils";
import { ReportItem, ReportItemLawyerType } from "@/types/congChung";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: (ReportItem | ReportItemLawyerType)[]; // Dữ liệu đầu vào
  defaultColumns: {
    // Danh sách các tiêu chí
    index: number;
    label: string;
  }[];
  activeColumns: string[]; // Các tiêu chí hiện tại
  groupByProvince?: boolean; // Nhóm theo tỉnh thành
  numOfProvinces?: number;
  loading?: boolean;
}

interface ChartDataset {
  label: string;
  data: (number | null)[];
  backgroundColor: string;
  barPercentage: number;
  categoryPercentage: number;
  barThickness: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

const CommonBarChart2 = ({
  data,
  defaultColumns,
  activeColumns,
  groupByProvince = false,
  numOfProvinces = 63,
  loading = false,
}: Props) => {
  const [parentContainerWidth, setParentContainerWidth] = useState(0);
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  // Tính độ rộng của chart dựa trên số cột hiển thị tối đã
  const defaultChartWidth = useMemo(() => {
    let maxNumOfColumns = 0;

    data.forEach((item, index) => {
      if (index > 0) {
        const numOfNonEmptyColumns =
          Object.entries(item).filter(
            (subItem) => subItem[1] !== "0" && subItem[1]
          )?.length - 1;

        if (numOfNonEmptyColumns > maxNumOfColumns) {
          maxNumOfColumns = numOfNonEmptyColumns;
        }
      }
    });

    return 10 * maxNumOfColumns * numOfProvinces;
  }, [data, numOfProvinces]);

  // Chart data mặc định
  const chartDataDefault = useCallback(() => {
    const indexArr = activeColumns?.length
      ? activeColumns
      : [...Array(defaultColumns.length).keys()];
    // const formattedChartData: BarChartData[] = [];

    const returnChartData: ChartData = {
      labels: [],
      datasets: [],
    };

    // Setup label
    indexArr?.forEach((item) => {
      const index = defaultColumns.findIndex(
        (sItem) => sItem.index.toString() === item
      );

      if (index !== -1) {
        const currentStatus = defaultColumns[index];
        // const newData: BarChartData = { label: currentStatus.label };
        returnChartData.labels.push(currentStatus.label);

        const currentDataset: ChartDataset = {
          label: currentStatus.label,
          data: [],
          backgroundColor: BAR_CHART_COLORS[index % BAR_CHART_COLORS.length],
          barPercentage: 0.5,
          categoryPercentage: 1,
          barThickness: 10,
        };

        // Dữ liệu API trả về có dạng {col_1: "Hà Nội", col_2: "123", ...}
        // returnData[0][1] sẽ trả về tên tỉnh thành
        // returnData[index][1] sẽ trả về giá trị của cột có index hiện tại
        data?.forEach((qItem, qIndex) => {
          const returnData = Object.entries(qItem);

          if (
            returnData?.[0]?.length &&
            returnData?.[currentStatus.index - 1]?.length &&
            qIndex > 0
          ) {
            const currentData = Number(returnData[currentStatus.index - 1][1]);

            currentDataset.data.push(currentData === 0 ? null : currentData);
          }
        });

        returnChartData.datasets.push(currentDataset);
      }
    });

    return returnChartData;
  }, [activeColumns, data, defaultColumns]);

  // chart data khi lấy dữ liệu cả nước
  // gọi khi activeColumns có 1 cột hoặc groupByProvince = true
  const chartDataByProvince = useCallback(() => {
    // const newChartData: BarChartData[] = [];
    const returnChartData: ChartData = {
      labels: [],
      datasets: [],
    };

    data?.forEach((item, index) => {
      if (index > 0) {
        returnChartData.labels.push(item.col_1);
      }
    });

    const indexArr = activeColumns?.length
      ? activeColumns
      : [...Array(defaultColumns.length).keys()];

    // Setup label
    indexArr?.forEach((item) => {
      const index = defaultColumns.findIndex(
        (sItem) => sItem.index.toString() === item
      );

      if (index !== -1) {
        const currentStatus = defaultColumns[index];

        const currentDataset: ChartDataset = {
          label: currentStatus.label,
          data: [],
          backgroundColor: BAR_CHART_COLORS[index % BAR_CHART_COLORS.length],
          barPercentage: 0.5,
          categoryPercentage: 1,
          barThickness: 10,
        };

        // Dữ liệu API trả về có dạng {col_1: "Hà Nội", col_2: "123", ...}
        // returnData[0][1] sẽ trả về tên tỉnh thành
        // returnData[index][1] sẽ trả về giá trị của cột có index hiện tại
        data?.forEach((qItem, qIndex) => {
          const returnData = Object.entries(qItem);

          if (
            returnData?.[0]?.length &&
            returnData?.[currentStatus.index - 1]?.length &&
            qIndex > 0
          ) {
            const currentData = Number(returnData[currentStatus.index - 1][1]);

            currentDataset.data.push(currentData === 0 ? null : currentData);
          }
        });

        returnChartData.datasets.push(currentDataset);
      }
    });

    return returnChartData;
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

  const options: ChartOptions<"bar"> = {
    skipNull: true,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  useEffect(() => {
    const updateWidth = () => {
      const chartContainer = document.getElementById("chart-container");
      if (chartContainer) {
        setParentContainerWidth(
          chartContainer?.parentElement?.offsetWidth || 0
        );
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth(); // Initial width update

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full relative",
        loading ? "overflow-hidden" : "overflow-x-auto"
      )}
    >
      {loading && (
        <div className="absolute w-full h-full flex items-center align-center">
          <Loader2 className="animate-spin w-6 h-6 grow" />
        </div>
      )}
      <div
        className={cn("relative min-h-[500px]", loading && "blur-xs")}
        id="chart-container"
        style={{
          width:
            defaultChartWidth > parentContainerWidth
              ? defaultChartWidth
              : parentContainerWidth,
        }}
      >
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CommonBarChart2;
