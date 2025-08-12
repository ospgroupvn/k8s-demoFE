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
import { cn, exportFilePOST } from "@/lib/utils";
import { getListProvince } from "@/service/common";
import { reportLawyerOrg } from "@/service/lawyer";
import { ReportItemLawyerType } from "@/types/congChung";
import { LawyerOrgReportItem, LawyerReportParams } from "@/types/luatSu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  org: z.array(z.string().trim()).optional(),
  aTypes: z.array(z.string()).min(1, "Vui lòng chọn tiêu chí"),
  isDomestic: z.string().trim().optional(),
});

// Mặc định có 6 tiêu chí
const DEFAULT_COLUMNS = [
  { index: 2, label: "Đang hoạt động" },
  { index: 3, label: "Tạm ngừng hoạt động" },
  { index: 4, label: "Đã bị thu hồi ĐKHĐ" },
  { index: 5, label: "Đã bị thu hồi giấy phép ĐKHĐ" },
  { index: 6, label: "Chấm dứt hoạt động" },
];

const ReportOrgLawyerActivity = () => {
  const [searchParam, setSearchParam] = useState<
    LawyerReportParams & { aTypes: string[] }
  >({
    pageNumber: 1,
    numberPerPage: 10,
    aTypes: ["2", "3", "4", "5", "6"],
    isDomestics: [0, 1],
  });
  const [loadingExcel, setLoadingExcel] = useState(false);

  const session = useSession();

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE, "lawyer"],
    queryFn: () => getListProvince(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.HOAT_DONG_TO_CHUC, searchParam],
    queryFn: reportLawyerOrg,
    refetchOnWindowFocus: false,
    enabled:
      !!provinceQuery?.data?.data?.length && !!searchParam?.provinceIds?.length,
  });

  const queryAll = useQuery({
    queryKey: [
      QUERY_KEY.LUAT_SU.HOAT_DONG_TO_CHUC_ALL,
      { ...searchParam, numberPerPage: 100, pageNumber: 1 },
    ],
    queryFn: reportLawyerOrg,
    refetchOnWindowFocus: false,
    enabled:
      !!provinceQuery?.data?.data?.length && !!searchParam?.provinceIds?.length,
  });

  const isQueryProvince = useMemo(() => {
    return (
      searchParam.provinceIds?.length === 0 ||
      searchParam.provinceIds?.length === provinceQuery?.data?.data?.length
    );
  }, [provinceQuery?.data?.data?.length, searchParam.provinceIds?.length]);

  const chartData: ReportItemLawyerType[] = useMemo(() => {
    const data = isQueryProvince
      ? queryAll.data?.data?.items
      : query.data?.data?.items;

    return (
      data?.map((item) => {
        return {
          col_1: item?.provinceName,
          col_2: item?.totalActive?.toString(),
          col_3: item?.totalInActive?.toString(),
          col_4: item?.totalRevoke1?.toString(),
          col_5: item?.totalRevoke2?.toString(),
          col_6: item?.totalDisable?.toString(),
        };
      }) || []
    );
  }, [isQueryProvince, query.data?.data?.items, queryAll.data?.data?.items]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org: [],
      aTypes: ["2", "3", "4", "5", "6"],
      isDomestic: "all",
    },
    values: {
      org:
        provinceQuery?.data?.data?.map((item) => item.id.toString() || "") ||
        [],
      aTypes: ["2", "3", "4", "5", "6"],
      isDomestic: "all",
    },
  });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  useEffect(() => {
    if (provinceQuery?.data?.data?.length) {
      setSearchParam((prev) => ({
        ...prev,
        provinceIds:
          provinceQuery?.data?.data?.map((item) => item.id.toString()) || [],
      }));
    }
  }, [provinceQuery?.data?.data]);

  const columns: ColumnDef<LawyerOrgReportItem>[] = [
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
      accessorKey: "province",
      header: () => <div className="text-left">Địa danh hành chính</div>,
      cell: ({ row }) => (
        <div
          className={cn(
            "text-left",
            row.index === 0 ? "font-bold" : "",
            "whitespace-nowrap"
          )}
        >
          {row.original.provinceName
            ?.replace("Tỉnh ", "")
            ?.replace("Thành phố ", "") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: "Đang hành nghề",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalActive || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("2"),
    },
    {
      accessorKey: "inactive",
      header: "Tạm ngừng hoạt động",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalInActive || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("3"),
    },
    {
      accessorKey: "revoke1",
      header: "Đã bị thu hồi ĐKHĐ",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalRevoke1 || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("4"),
    },
    {
      accessorKey: "revoke2",
      header: "Đã bị thu hồi giấy phép ĐKHĐ",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalRevoke2 || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("5"),
    },
    {
      accessorKey: "disable",
      header: "Chấm dứt hoạt động ",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalDisable || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("6"),
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
    setSearchParam((prev) => ({
      ...prev,
      pageNum: 1,
      provinceIds: values.org || [],
      aTypes: values.aTypes,
      isDomestics:
        values.isDomestic === "all" ? [0, 1] : [Number(values.isDomestic)],
    }));
  };

  const onExportClick = () => {
    setLoadingExcel(true);
    const url =
      process.env.NEXT_PUBLIC_API_URL + `/private/lorg/report/org-active/excel`;

    const filename = `${format(
      new Date(),
      "dd-MM-yyyy"
    )}_Báo cáo tình hình hoạt động của tổ chức HNLS.xlsx`;

    exportFilePOST(
      url,
      JSON.stringify({ ...searchParam, pageNumber: 1, numberPerPage: 10000 }),
      filename
    )
      .then(() => setLoadingExcel(false))
      .catch((error) => {
        setLoadingExcel(false);
        toast.error(
          error.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
          { richColors: true, position: "top-right" }
        );
      });
  };

  if (
    session.status === "unauthenticated" ||
    (session.data?.user?.type !== USER_TYPE.ADMIN &&
      session.data?.user?.type !== USER_TYPE.CUC_BO_TRO)
  ) {
    redirect("/");
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold mb-6 uppercase">
          TÌNH HÌNH HOẠT ĐỘNG CỦA TỔ CHỨC HÀNH NGHỀ LUẬT SƯ
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-6 gap-x-3 gap-y-1 items-start bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="org"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left  mb-4  col-span-2 max-sm:col-span-6">
                <FormControl>
                  <MultiSelect
                    disabled={
                      session?.data?.user?.type === USER_TYPE.SO_TU_PHAP
                    }
                    allowSelectAll
                    placeholder="Chọn Tỉnh/Thành phố"
                    value={field.value}
                    data={(provinceQuery?.data?.data || []).map((item) => ({
                      value: item?.id?.toString() || "",
                      label: item.name,
                    }))}
                    onChange={(values) => {
                      form.setValue(
                        "org",
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
              <FormItem className="flex flex-col items-left  mb-4  col-span-2 max-sm:col-span-6">
                <MultiSelect
                  allowSelectAll
                  placeholder="Chọn tiêu chí"
                  value={field.value}
                  data={DEFAULT_COLUMNS?.map((item) => ({
                    value: item?.index.toString(),
                    label: item.label,
                  }))}
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

          <FormField
            control={form.control}
            name="isDomestic"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left  mb-4  col-span-2 max-sm:col-span-6">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="1" key={1}>
                          Trong nước
                        </SelectItem>
                        <SelectItem value="0" key={0}>
                          Nước ngoài
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col col-span-6">
            <div className="flex justify-center space-x-4 w-full">
              <Button
                type="submit"
                className="bg-default-blue col-span-1 max-sm:col-span-3"
              >
                Tổng hợp số liệu
              </Button>
              {session.data?.user?.type !== USER_TYPE.SO_TU_PHAP ? (
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
              ) : (
                <></>
              )}
            </div>
          </div>
        </form>
      </Form>

      <Tabs defaultValue="chartTab" className="mt-3">
        <TabsList className="w-full justify-start bg-white rounded-lg shadow-sm">
          <TabsTrigger value="chartTab">Biểu đồ</TabsTrigger>
          <TabsTrigger value="tableTab">Bảng số liệu</TabsTrigger>
        </TabsList>
        <TabsContent
          value="tableTab"
          className="mt-4 bg-white p-4 rounded-lg shadow-sm"
        >
          <div id="table">
            <CommonTable
              data={query.data?.data}
              table={table}
              isLoading={provinceQuery.isFetching || query.isFetching}
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
          className="mt-4 w-full flex flex-col bg-white p-4 rounded-lg shadow-sm"
        >
          <p className="font-bold mb-4 w-full">
            Biểu đồ tình hình hoạt động của tổ chức hành nghề luật sư
          </p>
          <div className="overflow-y-auto">
            <CommonBarChart2
              loading={isQueryProvince ? query.isFetching : queryAll.isFetching}
              data={chartData || []}
              defaultColumns={DEFAULT_COLUMNS}
              activeColumns={searchParam?.aTypes || []}
              groupByProvince
              numOfProvinces={searchParam.provinceIds?.length}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ReportOrgLawyerActivity;
