"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import LineChartReport from "@/components/common/lineChart";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEY, USER_TYPE } from "@/constants/common";
import { reportPublicAuctionAsset } from "@/service/auctionOrg";
import { getListProvinceNew } from "@/service/common";
import { PublicAuctionAssetParam } from "@/types/dauGia";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  format,
  getMonth,
  getYear,
  isBefore,
} from "date-fns";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  cityId: z.string().trim().optional(),
  yearReport: z.string().min(1, "Vui lòng chọn năm"),
  monthReport: z.string().min(1, "Vui lòng chọn tháng"),
});

const ReportPublicAuctionByDay = () => {
  const currentYear = getYear(new Date());
  const currentMonth = getMonth(new Date()) + 1;
  const session = useSession();

  const [searchParam, setSearchParam] = useState<PublicAuctionAssetParam>({
    yearReport: currentYear.toString(),
    monthReport: currentMonth.toString(),
  });

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.THONG_KE_CONG_VIEC, searchParam],
    queryFn: reportPublicAuctionAsset,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityId: "",
      yearReport: currentYear.toString(),
      monthReport: currentMonth.toString(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchParam((prev) => ({
      ...prev,
      ...values,
      cityId: values.cityId ? Number(values.cityId) : undefined,
    }));
  };

  const chartData = useMemo(() => {
    const startDate = new Date(
      Number(searchParam?.yearReport),
      Number(searchParam?.monthReport) - 1,
      1
    );
    const startOfNextMonth = addMonths(startDate, 1);

    const chartData1: { label: string; value: number }[] = [];
    const chartData2: { label: string; value: number }[] = [];

    for (let i = startDate; isBefore(i, startOfNextMonth); i = addDays(i, 1)) {
      const dateStr = format(i, "dd/MM/yyyy");
      const queryItem = query?.data?.data?.find(
        (item) => item.publishDateStr === dateStr
      );

      chartData1.push({
        label: dateStr,
        value: queryItem?.countPerDay1 || 0,
      });

      chartData2.push({
        label: dateStr,
        value: queryItem?.countPerDay2 || 0,
      });
    }

    return { chartData1, chartData2 };
  }, [query?.data?.data, searchParam?.yearReport, searchParam?.monthReport]);

  if (
    session.status === "unauthenticated" ||
    (session.data?.user?.type !== USER_TYPE.ADMIN &&
      session.data?.user?.type !== USER_TYPE.CUC_BO_TRO)
  ) {
    redirect("/");
  }

  return (
    <>
      <h1 className="text-lg font-bold mb-6">
        THỐNG KÊ CÔNG VIỆC ĐẤU GIÁ TÀI SẢN
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-5 gap-x-2 gap-y-1 items-start max-sm:grid-cols-6 bg-white p-4 rounded-lg shadow-sm"
        >
          {session?.data?.user?.type !== USER_TYPE.SO_TU_PHAP ? (
            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                  <FormControl>
                    <AutoCompleteSearch
                      displayKey="name"
                      selectPlaceholder="Chọn Tỉnh/Thành phố"
                      emptyMsg="Không tìm thấy dữ liệu"
                      onSelect={(value) => {
                        field.onChange(value.id?.toString() || "");
                      }}
                      optionKey="id"
                      options={orgQuery?.data || []}
                      placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
                      value={field.value?.toString() || ""}
                      valueKey="id"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ) : (
            <></>
          )}

          <FormField
            control={form.control}
            name="yearReport"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-3">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        {Array.from({ length: 20 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={(currentYear - i).toString()}
                          >
                            {currentYear - i}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthReport"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-1 max-sm:col-span-3">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            Tháng {i + 1}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-default-blue col-span-1 max-sm:col-span-6"
          >
            Tổng hợp số liệu
          </Button>
        </form>

        <div className="bg-white mt-4 p-4 rounded-lg shadow-sm">
          <p className="font-bold mb-3">
            Thống kê diễn biến công khai việc đấu giá tài sản
          </p>
          <div className="overflow-x-auto">
            <LineChartReport
              data={chartData.chartData1}
              lineLabel="Thông báo/ngày"
            />
          </div>
        </div>

        <div className="bg-white mt-4 p-4 rounded-lg shadow-sm">
          <p className="font-bold mb-3">
            Thống kê thông báo lựa chọn tổ chức đấu giá tài sản
          </p>
          <div className="overflow-x-auto">
            <LineChartReport
              data={chartData.chartData2}
              lineLabel="Thông báo lựa chọn/ngày"
              lineColor="#FF928A"
            />
          </div>
        </div>
      </Form>
    </>
  );
};

export default ReportPublicAuctionByDay;
