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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUERY_KEY, USER_TYPE } from "@/constants/common";
import { cn, exportFile } from "@/lib/utils";
import { reportAuctionNotice } from "@/service/auctionOrg";
import { getListProvinceNew } from "@/service/common";
import { CommonReportParams } from "@/types/common";
import { ReportItem } from "@/types/congChung";
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
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  aTypes: z.array(z.string()).min(1, "Vui lòng chọn tiêu chí"),
});

const DEFAULT_COLUMNS = [
  { index: 2, label: "Thông báo có nội dung không phù hợp" },
  { index: 3, label: "Thông báo có nội dung phù hợp" },
  { index: 4, label: "Thông báo đã công khai" },
];

const ReportNotice = () => {
  const [searchParam, setSearchParam] = useState<CommonReportParams>({
    pageNumber: 1,
    numberPerPage: 10,
    aTypes: ["2", "3", "4"],
  });

  const [loadingExcel, setLoadingExcel] = useState(false);

  const allParams = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { numberPerPage, pageNumber, cityId, ...rest } = searchParam;
    return rest;
  }, [searchParam]);

  const session = useSession();

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.BAO_CAO_THONG_BAO, searchParam],
    queryFn: reportAuctionNotice,
    refetchOnWindowFocus: false,
  });

  const queryAll = useQuery({
    queryKey: [
      QUERY_KEY.DAU_GIA.BAO_CAO_THONG_BAO,
      { ...allParams, numberPerPage: 100, pageNumber: 1 },
    ],
    queryFn: reportAuctionNotice,
    refetchOnWindowFocus: false,
  });

  // isQueryProvince = true nếu người dùng thay đổi danh sách tỉnh thành đang tìm kiếm
  const isQueryProvince = useMemo(() => {
    return (
      searchParam.cityId?.toString()?.split(",")?.length &&
      searchParam.cityId?.toString()?.split(",")?.length <
        (orgQuery?.data?.length || 0)
    );
  }, [orgQuery?.data?.length, searchParam.cityId]);

  // const mapQuery = useQuery({
  //   queryKey: [
  //     QUERY_KEY.DAU_GIA.BAO_CAO_THONG_BAO,
  //     { aTypes: ["4"], numberPerPage: 100, pageNumber: 1 },
  //   ],
  //   queryFn: reportAuctionNotice,
  //   refetchOnWindowFocus: false,
  //   enabled: session.data?.user?.type !== USER_TYPE.SO_TU_PHAP,
  // });

  // const mapData: { name: string; value: string }[] = useMemo(() => {
  //   const newData: { name: string; value: string }[] = [];
  //   mapQuery?.data?.data?.items?.forEach((item, index) => {
  //     if (index > 0) {
  //       newData.push({
  //         name: item.col_1,
  //         value: item.col_4,
  //       });
  //     }
  //   });

  //   return newData;
  // }, [mapQuery?.data?.data?.items]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org: [],
      fromDate: undefined,
      toDate: undefined,
      aTypes: ["2", "3", "4"],
    },
    values: {
      aTypes: ["2", "3", "4"],
      org: orgQuery?.data?.map((item) => item.id?.toString() || "") || [],
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
      header: "Tỉnh/Thành phố",
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
        <div className="min-w-[100px]">Thông báo có nội dung không phù hợp</div>
      ),
      cell: ({ row }) => (
        <div className={cn(row.index === 0 ? "font-bold" : "")}>
          {row.original.col_2 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("2"),
    },
    {
      accessorKey: "col_3",
      header: () => (
        <div className="min-w-[100px]">Thông báo có nội dung phù hợp</div>
      ),
      cell: ({ row }) => (
        <div className={cn(row.index === 0 ? "font-bold" : "")}>
          {row.original.col_3 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("3"),
    },
    {
      accessorKey: "col_4",
      header: () => <div className="min-w-[100px]">Thông báo đã công khai</div>,
      cell: ({ row }) => (
        <div className={cn(row.index === 0 ? "font-bold" : "")}>
          {row.original.col_4 || "-"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("4"),
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
      pageNumber: 1,
      cityId: values.org ? values.org.join(",") : "",
      fromDate: values?.fromDate
        ? format(values.fromDate, "dd/MM/yyyy")
        : undefined,
      toDate: values?.toDate ? format(values.toDate, "dd/MM/yyyy") : undefined,
      aTypes: values.aTypes,
    }));
  };

  const onExportClick = () => {
    setLoadingExcel(true);
    let url =
      process.env.NEXT_PUBLIC_API_URL +
      `/private/dgts/report-notice-auction/export?`;

    const searchParams = new URLSearchParams();
    Object.entries(searchParam)?.forEach((item) => {
      if (typeof item[1] !== "undefined" && item[1] !== null) {
        searchParams.append(item[0], item[1].toString());
      }
    });

    const filename = `${format(
      new Date(),
      "dd-MM-yyyy"
    )}_Báo cáo tổng hợp số liệu thông báo công khai việc đấu giá.xlsx`;
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
        BÁO CÁO TỔNG HỢP SỐ LIỆU THÔNG BÁO CÔNG KHAI VIỆC ĐẤU GIÁ
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-6 gap-x-3 gap-y-1 items-start bg-white p-4 rounded-lg shadow-sm"
        >
          {session?.data?.user?.type !== USER_TYPE.SO_TU_PHAP ? (
            <FormField
              control={form.control}
              name="org"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                  <FormControl>
                    <MultiSelect
                      allowSelectAll
                      placeholder="Chọn Tỉnh/Thành phố"
                      value={field.value}
                      data={(orgQuery?.data || []).map((item) => ({
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
          ) : (
            <></>
          )}

          <FormField
            control={form.control}
            name="aTypes"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
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
          className="mt-4 w-full flex flex-col bg-white p-4 rounded-lg shadow-sm"
        >
          <p className="font-bold mb-4 w-full">
            Biểu đồ tổng hợp số liệu thông báo công khai việc đấu giá
          </p>
          <div className="overflow-y-auto">
            <CommonBarChart2
              loading={isQueryProvince ? query.isFetching : queryAll.isFetching}
              data={
                (isQueryProvince
                  ? query.data?.data?.items
                  : queryAll.data?.data?.items) || []
              }
              defaultColumns={DEFAULT_COLUMNS}
              activeColumns={searchParam?.aTypes || []}
              groupByProvince
              numOfProvinces={
                searchParam.cityId?.toString()?.split(",")?.length
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ReportNotice;
