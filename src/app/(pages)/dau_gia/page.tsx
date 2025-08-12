"use client";

import MapChart from "@/components/common/map";
import DashboardCharts from "@/components/dashboard/charts";
import DashboardCard from "@/components/dashboard/dashboardCard";
import { QUERY_KEY, SCREENS_SIZE, USER_TYPE } from "@/constants/common";
import useWindowSize from "@/hooks/useWindowResize";
import { cn } from "@/lib/utils";
import { reportAuctionDashboard2 } from "@/service/auctionOrg";
import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const NotaryHome = () => {
  const currentYear = getYear(new Date());
  const session = useSession();
  const router = useRouter();

  const windowSize = useWindowSize();
  const isMobile =
    windowSize?.width > 0 && windowSize?.width <= SCREENS_SIZE.md;

  const { data: dashboardData, isFetching: isDashboardFetching } = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.DASHBOARD, {}],
    queryFn: reportAuctionDashboard2,
    refetchOnWindowFocus: false,
  });

  const onProvinceClick = (name: string) => {
    if (name) {
      window.open(
        `${
          window.location.origin
        }/dau_gia/to_chuc?province=${encodeURIComponent(name)}`
      );
    }
  };

  redirect("/")

  return (
    <>
      <p className="text-xl font-bold">
        HOẠT ĐỘNG CỦA TỔ CHỨC HÀNH NGHỀ ĐẤU GIÁ VÀ ĐẤU GIÁ VIÊN
      </p>

      <div className="flex flex-wrap gap-2 justify-between mt-4 max-sm:flex-col">
        <DashboardCard
          title="Số tổ chức hành nghề đấu giá"
          value={dashboardData?.data?.tk_dgts_to_chuc || 0}
          percentage={dashboardData?.data?.tk_dgts_to_chuc_growth}
          isLoading={isDashboardFetching}
          color="#3CC3DF"
          onClick={() => router.push("/dau_gia/to_chuc")}
        />
        <DashboardCard
          title="Số ĐGV đăng ký HNĐG"
          value={dashboardData?.data?.tk_dgts_dgv || 0}
          percentage={dashboardData?.data?.tk_dgts_dgv_growth}
          isLoading={isDashboardFetching}
          color="#FF928A"
          onClick={() => router.push("/dau_gia/dau_gia_vien")}
        />
        <DashboardCard
          title="Tình hình công khai thông báo đấu giá"
          value={Number(dashboardData?.data?.tk_dgts_tb_dau_gia) || 0}
          percentage={dashboardData?.data?.tk_dgts_tb_dau_gia_growth}
          isLoading={isDashboardFetching}
          color="#537FF1"
          onClick={() => router.push("/dau_gia/bao_cao_thong_bao")}
        />
        <DashboardCard
          title="Số thông báo lựa chọn đấu giá"
          value={Number(dashboardData?.data?.tk_dgts_tb_lua_chon) || 0}
          percentage={dashboardData?.data?.tk_dgts_tb_lua_chon_growth}
          isLoading={isDashboardFetching}
          color="#FFAE4C"
          onClick={() => router.push("/dau_gia/thong_bao_lua_chon")}
        />
      </div>

      <div className="grid grid-cols-2 grid-rows-[repeat(2,1fr)] mt-4 gap-2">
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
              Mức độ phân bố tổ chức đấu giá tài sản tại Việt Nam
            </div>

            <MapChart
              data={
                Object.values(dashboardData?.data?.dataMap || {})?.map(
                  (item: any) => ({
                    name: item?.name,
                    value: item?.value,
                  })
                ) || []
              }
              isLoading={isDashboardFetching}
              legendLabel="Mức độ phân bổ theo số lượng tổ chức đấu giá tài sản"
              showLegend={!isMobile}
              ratio={1.5}
              onProvinceClick={onProvinceClick}
            />
          </div>
        ) : (
          <></>
        )}

        <div className="col-span-1 row-span-1 max-sm:col-span-2">
          <DashboardCharts
            label="Biểu đồ tổng hợp theo loại tổ chức hành nghề đấu giá tài sản"
            data={dashboardData?.data?.tk_pie_dgts_th_theo_loai_tc_hndg || []}
            labelFormat="percent"
          />
        </div>

        <div className="col-span-1 row-span-1 max-sm:col-span-2">
          <DashboardCharts
            label={`Thống kế tình hình cấp chứng chỉ hành nghề đấu giá năm ${currentYear}`}
            data={dashboardData?.data?.tk_pie_dgts_th_theo_cap_cchn_dg || []}
            labelFormat="percent"
          />
        </div>
      </div>
    </>
  );
};

export default NotaryHome;
