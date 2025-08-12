"use client";

import CommonBarChart2 from "@/components/common/barChart2";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUERY_KEY, USER_TYPE } from "@/constants/common";
import { cn, exportFile, hasPermission } from "@/lib/utils";
import { getListProvinceNew } from "@/service/common";
import { notaryOperationReport } from "@/service/notaryOrg";
import { NotaryOperationParams, ReportItem } from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, getMonth, getYear } from "date-fns";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  yearReport: z
    .string()
    .trim()
    .refine((val) => val.length > 0, { message: "Vui lòng chọn năm" }),
  monthReport: z.array(z.string()).min(1, "Vui lòng chọn tháng"),
  cityId: z.array(z.string().trim()).optional(),
  aTypes: z.array(z.string()).min(1, "Vui lòng chọn tiêu chí"),
});

const DEFAULT_COLUMNS = [
  { index: 2, label: "Số CCV thực hiện (trong tháng báo cáo)" },
  { index: 3, label: "Tổng số việc ước tính (Trong kỳ)" },
  { index: 4, label: "Số ước tính của tháng cuối kỳ" },
  { index: 5, label: "Số công việc công chứng hợp đồng, giao dịch" },
  { index: 6, label: "Số công việc công chứng bản dịch và các loại khác" },
  { index: 7, label: "Tổng số công việc" },
  { index: 8, label: "Tổng thù lao công chứng" },
  { index: 9, label: "Tổng số phí công chứng" },
  { index: 10, label: "Số tiền nộp ngân sách của các tổ chức công chứng" },
  { index: 11, label: "Số TCHN CC có báo cáo" },
  { index: 12, label: "Số TCHN CC đăng ký hoạt động" },
  { index: 13, label: "Số CCV đăng ký HNCC" },
];

const NotaryOperationReport = () => {
  const session = useSession();
  const currentYear = getYear(new Date());
  const currentMonth = getMonth(new Date()) + 1;
  const [searchParam, setSearchParam] = useState<NotaryOperationParams>({
    pageNumber: 1,
    numberPerPage: 10,
    yearReport: currentYear,
    monthReport: [currentMonth.toString()],
    aTypes: Array.from({ length: DEFAULT_COLUMNS.length }, (_, i) =>
      (i + 2).toString()
    ),
  });
  const [loadingExcel, setLoadingExcel] = useState(false);

  const allParams = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { numberPerPage, pageNumber, cityId, ...rest } = searchParam;
    return rest;
  }, [searchParam]);

  if (
    !hasPermission(
      "ROLE_NOTARY_ACTIVITY_VIEW",
      session.data?.user?.authorities || []
    ) ||
    session.status === "unauthenticated" ||
    (session.data?.user?.type !== USER_TYPE.ADMIN &&
      session.data?.user?.type !== USER_TYPE.CUC_BO_TRO)
  ) {
    redirect("/trang_chu");
  }

  const showJobChart =
    searchParam.aTypes?.includes("5") && searchParam.aTypes?.includes("6");
  const showFeesChart =
    searchParam.aTypes?.includes("8") &&
    searchParam.aTypes?.includes("9") &&
    searchParam.aTypes?.includes("10");

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.OPERATION_REPORT, searchParam],
    queryFn: notaryOperationReport,
    refetchOnWindowFocus: false,
  });

  const queryAllJob = useQuery({
    queryKey: [
      QUERY_KEY.CONG_CHUNG.BAO_CAO_BO_NHIEM,
      { ...allParams, numberPerPage: 100, pageNumber: 1 },
    ],
    queryFn: notaryOperationReport,
    refetchOnWindowFocus: false,
    enabled: showJobChart,
  });

  const queryAllFees = useQuery({
    queryKey: [
      QUERY_KEY.CONG_CHUNG.BAO_CAO_BO_NHIEM,
      { ...searchParam, numberPerPage: 100, pageNumber: 1 },
    ],
    queryFn: notaryOperationReport,
    refetchOnWindowFocus: false,
    enabled: showFeesChart,
  });

  // isQueryProvince = true nếu người dùng thay đổi danh sách tỉnh thành đang tìm kiếm
  const isQueryProvince = useMemo(() => {
    return (
      searchParam.cityId?.toString()?.split(",")?.length &&
      searchParam.cityId?.toString()?.split(",")?.length <
        (orgQuery?.data?.length || 0)
    );
  }, [orgQuery?.data?.length, searchParam.cityId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearReport: currentYear.toString(),
      monthReport: [currentMonth.toString()],
      cityId: [],
      aTypes: ["1", "2", "3"],
    },
    values: {
      yearReport: currentYear.toString(),
      monthReport: [currentMonth.toString()],
      aTypes: ["1", "2", "3"],
      cityId: orgQuery?.data?.map((item) => item.provinceCode || "") || [],
    },
  });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  const columns: ColumnDef<ReportItem>[] = [
    {
      accessorKey: "STT",
      header: "STT",
      cell: ({ row }) => {
        if (row.index === 0) return "";

        return (
          (searchParam.pageNumber - 1) * searchParam.numberPerPage + row.index
        );
      },
    },
    {
      accessorKey: "col_1",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">Tỉnh/Thành phố</div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            "text-left",
            row.index === 0 ? "font-bold" : "",
            "whitespace-nowrap"
          )}
        >
          {row.original.col_1 || "-"}
        </div>
      ),
    },
    {
      accessorKey: "col_2",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Số CCV thực hiện (trong tháng báo cáo)
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_2 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("2"),
    },
    {
      accessorKey: "col_3",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Tổng số việc ước tính (Trong kỳ)
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_3 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("3"),
    },
    {
      accessorKey: "col_4",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Số ước tính của tháng cuối kỳ
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_4 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("4"),
    },
    {
      accessorKey: "col_5",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Số công việc công chứng hợp đồng, giao dịch
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_5 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("5"),
    },
    {
      accessorKey: "col_6",
      header: () => (
        <div className="line-clamp-3 min-w-[150px]">
          Số công việc công chứng bản dịch và các loại khác
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_6 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("6"),
    },
    {
      accessorKey: "col_7",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">Tổng số công việc</div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_7 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("7"),
    },
    {
      accessorKey: "col_8",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Tổng thù lao công chứng
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {Number(row.original.col_8 || "0").toLocaleString("vi-VN") || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("8"),
    },
    {
      accessorKey: "col_9",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">Tổng số phí công chứng</div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {Number(row.original.col_9 || "0").toLocaleString("vi-VN") || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("9"),
    },
    {
      accessorKey: "col_10",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Số tiền nộp ngân sách của các tổ chức công chứng
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {Number(row.original.col_10 || "0").toLocaleString("vi-VN") || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("10"),
    },
    {
      accessorKey: "col_11",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">Số TCHN CC có báo cáo</div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_11 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("11"),
    },
    {
      accessorKey: "col_12",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">
          Số TCHN CC đăng ký hoạt động
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_12 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("12"),
    },
    {
      accessorKey: "col_13",
      header: () => (
        <div className="line-clamp-3 min-w-[120px]">Số CCV đăng ký HNCC</div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.col_13 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("13"),
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: query.data?.data?.items || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: (searchParam.numberPerPage || 10) + 1,
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const aTypesValues: string[] = [];

    if (values?.aTypes?.includes("1")) {
      aTypesValues.push("5", "6");
    }
    if (values?.aTypes?.includes("2")) {
      aTypesValues.push("8", "9", "10");
    }

    if (values?.aTypes?.includes("3")) {
      aTypesValues.push("2", "3", "4", "7", "11", "12", "13");
    }

    setSearchParam((prev) => ({
      ...prev,
      pageNumber: 1,
      cityId: values.cityId ? values.cityId.join(",") : undefined,
      aTypes: aTypesValues,
      monthReport: values.monthReport,
      yearReport: values.yearReport ? Number(values.yearReport) : undefined,
    }));
  };

  const onExportClick = () => {
    setLoadingExcel(true);
    let url =
      process.env.NEXT_PUBLIC_API_URL +
      `/private/tccc/notary-activity/export-excel-aggregate-by-stp?`;

    const searchParams = new URLSearchParams();
    Object.entries(searchParam)?.forEach((item) => {
      if (typeof item[1] !== "undefined" && item[1] !== null) {
        searchParams.append(item[0], item[1].toString());
      }
    });

    const filename = `${format(
      new Date(),
      "dd-MM-yyyy"
    )}_Báo cáo hoạt động công chứng.xlsx`;
    url += searchParams.toString();

    exportFile(url, filename)
      .then(() => setLoadingExcel(false))
      .catch((error) => {
        setLoadingExcel(false);
        toast.error(
          error.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
          { richColors: true, position: "top-right" }
        );
      });
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">BÁO CÁO HOẠT ĐỘNG CÔNG CHỨNG</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-8 gap-x-2 gap-y-1 items-start max-sm:grid-cols-6">
            <FormField
              control={form.control}
              name="yearReport"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
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
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                  <MultiSelect
                    allowSelectAll
                    placeholder="Chọn tháng"
                    value={field.value}
                    data={Array.from({ length: 12 }, (_, i) => ({
                      value: (i + 1).toString(),
                      label: `Tháng ${i + 1}`,
                    }))}
                    onChange={(values) => {
                      form.setValue(
                        "monthReport",
                        values?.map((item) => item.value)
                      );
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                  <FormControl>
                    <MultiSelect
                      allowSelectAll
                      placeholder="Chọn Tỉnh/Thành phố"
                      value={field.value}
                      data={(orgQuery?.data || []).map((item) => ({
                        value: item?.provinceCode || "",
                        label: item.name,
                      }))}
                      onChange={(values) => {
                        form.setValue(
                          "cityId",
                          values?.map((item) => item.value)
                        );
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aTypes"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                  <MultiSelect
                    allowSelectAll
                    placeholder="Chọn tiêu chí"
                    value={field.value}
                    data={[
                      {
                        label: "Công việc",
                        value: "1",
                      },
                      {
                        label: "Thù lao và nộp thuế",
                        value: "2",
                      },
                      {
                        label: "Tiêu chí khác",
                        value: "3",
                      },
                    ]}
                    onChange={(values) => {
                      form.setValue(
                        "aTypes",
                        values?.map((item) => item.value)
                      );
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-center gap-x-2 mt-2">
            <Button
              type="submit"
              className="bg-default-blue col-span-1 max-sm:col-span-3"
            >
              Tổng hợp số liệu
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border border-[#222222] col-span-1 max-sm:col-span-3"
              onClick={() => {
                form.reset();
                form.handleSubmit(onSubmit)();
              }}
            >
              Xóa điều kiện
            </Button>
          </div>
        </form>
      </Form>

      <Tabs defaultValue="chartTab" className="mt-3">
        <TabsList className="bg-white w-full justify-start">
          <TabsTrigger value="chartTab">Biểu đồ</TabsTrigger>
          <TabsTrigger value="tableTab">Bảng số liệu</TabsTrigger>
        </TabsList>
        <TabsContent value="tableTab" className="bg-white pt-2 mt-0">
          <div className="mt-4" id="table">
            <CommonTable
              data={query.data?.data}
              table={table}
              isLoading={orgQuery.isFetching || query.isFetching}
              showIndex={false}
              showExport={true}
              onExport={onExportClick}
              loadingExport={loadingExcel}
            />

            <CommonPagination
              data={query.data?.data}
              setSearchParam={setSearchParam}
              searchParam={searchParam}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="chartTab"
          className="bg-white pt-2 mt-0 w-full flex flex-col px-2"
        >
          {showJobChart ? (
            <>
              <p className="font-bold mb-4 w-full">
                Biểu đồ thống kê số công việc công chứng
              </p>
              <div className="overflow-y-auto">
                <CommonBarChart2
                  loading={
                    isQueryProvince ? query.isFetching : queryAllJob.isFetching
                  }
                  data={
                    (isQueryProvince
                      ? query.data?.data?.items
                      : queryAllJob.data?.data?.items) || []
                  }
                  defaultColumns={DEFAULT_COLUMNS}
                  activeColumns={["5", "6"]}
                  groupByProvince
                  numOfProvinces={
                    searchParam.cityId?.toString()?.split(",")?.length
                  }
                />
              </div>
            </>
          ) : (
            <></>
          )}

          {showFeesChart ? (
            <>
              <p className="font-bold mb-4 w-full mt-8">
                Biểu đồ thống kê thù lao công chứng và nộp ngân sách
              </p>
              <div className="overflow-y-auto">
                <CommonBarChart2
                  loading={
                    isQueryProvince ? query.isFetching : queryAllFees.isFetching
                  }
                  data={
                    (isQueryProvince
                      ? query.data?.data?.items
                      : queryAllFees.data?.data?.items) || []
                  }
                  defaultColumns={DEFAULT_COLUMNS}
                  activeColumns={["8", "9", "10"]}
                  groupByProvince
                  numOfProvinces={
                    searchParam.cityId?.toString()?.split(",")?.length
                  }
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default NotaryOperationReport;
