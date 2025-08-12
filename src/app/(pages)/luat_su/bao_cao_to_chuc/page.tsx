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
import { cn, exportFilePOST } from "@/lib/utils";
import { getListProvince } from "@/service/common";
import { reportLawyerByProvince } from "@/service/lawyer";
import { ReportItemLawyerType } from "@/types/congChung";
import { LawyerAreaReportItem, LawyerReportParams } from "@/types/luatSu";
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
});

// Mặc định có 6 tiêu chí
const DEFAULT_COLUMNS = [
  { index: 2, label: "Trong nước" },
  { index: 3, label: "Nước ngoài" },
];

const ReportOrgLawyer = () => {
  const [searchParam, setSearchParam] = useState<
    LawyerReportParams & { aTypes: string[] }
  >({
    pageNumber: 1,
    numberPerPage: 10,
    isOrg: 1,
    aTypes: ["2", "3"],
  });
  const [loadingExcel, setLoadingExcel] = useState(false);

  const session = useSession();

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE, "lawyer"],
    queryFn: () => getListProvince(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.BAO_CAO_TO_CHUC, searchParam],
    queryFn: reportLawyerByProvince,
    refetchOnWindowFocus: false,
    enabled:
      !!provinceQuery?.data?.data?.length && !!searchParam?.provinceIds?.length,
  });

  const queryAll = useQuery({
    queryKey: [
      QUERY_KEY.LUAT_SU.BAO_CAO_TO_CHUC_ALL,
      { ...searchParam, numberPerPage: 100, pageNumber: 1 },
    ],
    queryFn: reportLawyerByProvince,
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
      ? query.data?.data?.items
      : queryAll.data?.data?.items;

    return (
      data?.map((item) => {
        return {
          col_1: item.provinceName,
          col_2: item.totalIn.toString(),
          col_3: item.totalOut.toString(),
        };
      }) || []
    );
  }, [isQueryProvince, query.data?.data?.items, queryAll.data?.data?.items]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org: [],
      aTypes: ["2", "3"],
    },
    values: {
      org:
        provinceQuery?.data?.data?.map((item) => item.id.toString() || "") ||
        [],
      aTypes: ["2", "3"],
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

  const columns: ColumnDef<LawyerAreaReportItem>[] = [
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
      accessorKey: "domestic",
      header: "Tổ chức hành nghề Luật sư trong nước",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalIn || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("2"),
    },
    {
      accessorKey: "foreign",
      header: "Tổ chức hành nghề Luật sư nước ngoài",
      cell: ({ row }) => (
        <div
          className={cn(
            row.index === 0 ? "font-bold" : "",
            "max-sm:min-w-[50px]"
          )}
        >
          {row.original.totalOut || "0"}
        </div>
      ),
      enableHiding:
        !!searchParam?.aTypes?.length && !searchParam?.aTypes?.includes("3"),
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
    }));
  };

  const onExportClick = () => {
    setLoadingExcel(true);
    const url =
      process.env.NEXT_PUBLIC_API_URL +
      `/private/lorg/report/area/excel?isOrg=${searchParam.isOrg}&pageNum=1&pageSize=10000`;

    const filename = `${format(
      new Date(),
      "dd-MM-yyyy"
    )}_Báo cáo số liệu tổ chức HNLS.xlsx`;

    exportFilePOST(url, JSON.stringify(searchParam.provinceIds), filename)
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
        BÁO CÁO SỐ LIỆU TỔ CHỨC HÀNH NGHỀ LUẬT SƯ ĐANG HOẠT ĐỘNG
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
            Biểu đồ số liệu tổ chức hành nghề Luật sư đang hoạt động
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

export default ReportOrgLawyer;
