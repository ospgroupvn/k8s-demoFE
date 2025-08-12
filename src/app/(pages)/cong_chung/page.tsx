"use client";

import MapChart from "@/components/common/map";
import DashboardCharts from "@/components/dashboard/charts";
import DashboardCard from "@/components/dashboard/dashboardCard";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { QUERY_KEY, SCREENS_SIZE, USER_TYPE } from "@/constants/common";
import useWindowSize from "@/hooks/useWindowResize";
import { cn } from "@/lib/utils";
import { getAllOrganization } from "@/service/auctionOrg";
import { reportNotaryDashboard } from "@/service/notaryOrg";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const NotaryHome = () => {
  const session = useSession();
  const router = useRouter();

  const windowSize = useWindowSize();
  const isMobile =
    windowSize?.width > 0 && windowSize?.width <= SCREENS_SIZE.md;

  const { data: dashboardData, isFetching: isDashboardFetching } = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.DASHBOARD, {}],
    queryFn: reportNotaryDashboard,
    refetchOnWindowFocus: false,
  });

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP, "deprecated"],
    queryFn: () => getAllOrganization("client"),
    enabled: session?.data?.user?.type === USER_TYPE.SO_TU_PHAP,
    refetchOnWindowFocus: false,
  });

  const currentProvinceName =
    provinceQuery?.data?.data?.find(
      (item) =>
        item.cityCode === session.data?.user?.administrationId?.toString()
    )?.fullName || "";

  const chartConfig = {
    value: {
      label: "Số lượng tổ chức công chứng",
      color: "#37b1cb",
    },
  } satisfies ChartConfig;

  const onProvinceClick = (name: string) => {
    if (name) {
      window.open(
        `${
          window.location.origin
        }/cong_chung/to_chuc?province=${encodeURIComponent(name)}`
      );
    }
  };

  redirect("/")

  return (
    <>
      <p className="text-xl font-bold">
        TỔ CHỨC HÀNH NGHỀ CÔNG CHỨNG VÀ CÔNG CHỨNG VIÊN
      </p>

      <div
        className={cn(
          "flex flex-wrap gap-2 justify-between mt-4 max-sm:flex-col"
        )}
      >
        <DashboardCard
          title="Số tổ chức hành nghề công chứng"
          value={dashboardData?.data?.tk_tccc_ds_tccc || 0}
          percentage={dashboardData?.data?.tk_tccc_ds_tccc_growth}
          isLoading={isDashboardFetching}
          color="#3CC3DF"
          onClick={() => router.push("/cong_chung/to_chuc")}
        />
        <DashboardCard
          title="Số CCV đăng ký HNCC"
          value={dashboardData?.data?.tk_tccc_ds_cgv || 0}
          percentage={dashboardData?.data?.tk_tccc_ds_cgv_growth}
          isLoading={isDashboardFetching}
          color="#FF928A"
          onClick={() => router.push("/cong_chung/cong_chung_vien")}
        />
        <DashboardCard
          title="Số việc công chứng"
          value={Number(dashboardData?.data?.HSCC_da_thuc_hien) || 0}
          percentage={dashboardData?.data?.HSCC_da_thuc_hien_growth}
          isLoading={isDashboardFetching}
          color="#537FF1"
          onClick={() => router.push("/cong_chung/hoat_dong")}
        />
        <DashboardCard
          title="Số VPCC được thành lập"
          value={Number(dashboardData?.data?.VPCC_duoc_phep_tl) || 0}
          percentage={dashboardData?.data?.VPCC_duoc_phep_tl_growth}
          isLoading={isDashboardFetching}
          color="#FFAE4C"
          onClick={() => router.push("/cong_chung/to_chuc")}
        />
      </div>

      <div
        className={cn(
          "grid grid-cols-2 mt-4 gap-x-2 gap-y-4",
          session.data?.user?.type !== USER_TYPE.SO_TU_PHAP
            ? "grid-rows-[repeat(2,1fr)]"
            : ""
        )}
      >
        {session.data?.user?.type !== USER_TYPE.SO_TU_PHAP ? (
          <div
            className={cn(
              "relative w-full min-h-0 col-span-1 row-span-2 bg-white p-4 shadow-lg contain-size",
              "max-sm:col-span-2 max-sm:row-span-1 max-sm:row-start-3"
            )}
          >
            {isDashboardFetching ? (
              <div className="absolute w-full h-full flex items-center justify-center -m-4">
                <Loader2 className="text-lg animate-spin" />
              </div>
            ) : (
              <></>
            )}

            <div className="mb-4 font-semibold">
              Bản đồ phân bổ tổ chức hành nghề công chứng tại Việt Nam
            </div>

            <MapChart
              data={
                dashboardData?.data?.dataMap?.filter(
                  (item) => item.name !== "Tổng số"
                ) || []
              }
              isLoading={isDashboardFetching}
              legendLabel="Mức độ phân bổ theo số lượng tổ chức công chứng"
              showLegend={!isMobile}
              ratio={1.5}
              onProvinceClick={onProvinceClick}
            />
          </div>
        ) : (
          <></>
        )}

        <div className="col-span-1 row-span-1 shadow-lg h-fit max-sm:col-span-2">
          <DashboardCharts
            label="Thống kê tình hình bổ nhiệm Công chứng viên"
            data={dashboardData?.data?.tk_pie_th_bo_nhiem_ccv || []}
            labelFormat="percent"
          />
        </div>

        <div className="col-span-1 row-span-1 shadow-lg h-fit max-sm:col-span-2">
          <DashboardCharts
            label="Biểu đồ tổng hợp theo loại công việc công chứng"
            data={dashboardData?.data?.tk_pie_loai_cong_chung || []}
            labelFormat="percent"
          />
        </div>
      </div>

      {session?.data?.user?.type === USER_TYPE.SO_TU_PHAP ? (
        <div className="relative row-span-1 bg-white p-2 shadow-lg mt-4">
          {isDashboardFetching ? (
            <div className="absolute w-full h-full flex items-center justify-center -m-4">
              <Loader2 className="text-lg animate-spin" />
            </div>
          ) : (
            <></>
          )}
          <p className="font-bold mb-2">
            Biểu đồ phân bố số lượng tổ chức hành nghề công chứng trên các quận,
            huyện tại {currentProvinceName}
          </p>
          <div className="overflow-x-auto">
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] max-h-[500px] min-w-full"
              style={{
                width: (dashboardData?.data?.dataChartCity?.length || 0) * 40,
              }}
            >
              <BarChart
                accessibilityLayer
                data={dashboardData?.data?.dataChartCity?.map((item) => ({
                  ...item,
                  value: Number(item.value || "0"),
                }))}
                margin={{
                  right: 80,
                  bottom: 100,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => {
                    if (value.length > 30) {
                      return `${value.substring(0, 30)}...`;
                    }

                    return value;
                  }}
                  angle={45}
                  textAnchor="start"
                  interval={0}
                />
                <YAxis domain={[0, "dataMax + 5"]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                {Object.keys(chartConfig).map((key) => (
                  <Bar barSize={10} key={key} dataKey={key} fill={"#37b1cb"} />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NotaryHome;
