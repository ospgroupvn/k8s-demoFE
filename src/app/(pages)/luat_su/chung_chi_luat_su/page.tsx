"use client";

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
import { QUERY_KEY, USER_TYPE } from "@/constants/common";
import { THE_LS_STATUS } from "@/constants/luat_su";
import { exportFilePOST } from "@/lib/utils";
import { getListProvince } from "@/service/common";
import { reportLawyerCCHN } from "@/service/lawyer";
import { LawyerCCHNReportItem, LawyerParamsPrivate } from "@/types/luatSu";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  org: z.string().trim().optional(),
  aTypes: z.array(z.string()).min(1, "Vui lòng chọn tiêu chí"),
  isDomestic: z.string().trim().optional(),
});

const DEFAULT_COLUMNS = [
  { index: 2, label: "Ngày sinh" },
  { index: 3, label: "Giới tính" },
  { index: 4, label: "Địa chỉ thường trú" },
  { index: 5, label: "Số CCHN Luật sư" },
  { index: 6, label: "Quyết định" },
  { index: 7, label: "Ngày cấp" },
  { index: 8, label: "Trạng thái cấp thẻ LS" },
];

const ReportLawyerCert = () => {
  const [searchParam, setSearchParam] = useState<
    LawyerParamsPrivate & { aTypes: string[] }
  >({
    pageNumber: 1,
    numberPerPage: 10,
    isDomestic: 1,
    aTypes: ["2", "3", "4", "5", "6", "7", "8"],
  });
  const [loadingExcel, setLoadingExcel] = useState(false);

  const session = useSession();

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE, "lawyer"],
    queryFn: () => getListProvince(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.CHUNG_CHI_LUAT_SU, searchParam],
    queryFn: reportLawyerCCHN,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org: "",
      aTypes: ["2", "3", "4", "5", "6", "7", "8"],
      isDomestic: "1",
    },
  });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  const columns: ColumnDef<LawyerCCHNReportItem>[] = [
    {
      accessorKey: "name",
      header: "Họ và tên",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.fullName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.dateOfBirth
            ? format(row.original.dateOfBirth, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("2"),
    },
    {
      accessorKey: "gender",
      header: "Giới tính",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.gender === 1 ? "Nam" : "Nữ"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("3"),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ thường trú",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.address || "-"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("4"),
    },
    {
      accessorKey: "card",
      header: "Số CCHN Luật sư",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.certificateNumber || "-"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("5"),
    },
    {
      accessorKey: "decision",
      header: "Quyết định",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.decisionNumber || "-"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("6"),
    },
    {
      accessorKey: "issueDate",
      header: "Ngày cấp",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {row.original.issueDate
            ? format(row.original.issueDate, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("7"),
    },
    {
      accessorKey: "status",
      header: "Trạng thái cấp thẻ LS",
      cell: ({ row }) => (
        <div className="max-sm:min-w-[50px] text-left">
          {THE_LS_STATUS.find((item) => item.value === row.original.status)
            ?.label || "-"}
        </div>
      ),
      enableHiding: !searchParam.aTypes?.includes("8"),
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
      provinceId: values.org,
      aTypes: values.aTypes,
      isDomestic: Number(values.isDomestic || "1"),
    }));
  };

  const onExportClick = () => {
    setLoadingExcel(true);
    const url =
      process.env.NEXT_PUBLIC_API_URL + `/private/lstc/report/law-cchn/excel`;

    const filename = `${format(
      new Date(),
      "dd-MM-yyyy"
    )}_Báo cáo cấp chứng chỉ HNLS.xlsx`;

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
      <h1 className="text-lg font-bold mb-6">
        DANH SÁCH CẤP CHỨNG CHỈ HÀNH NGHỀ LUẬT SƯ
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-6 gap-x-3 gap-y-1 items-start bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="org"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        {provinceQuery?.data?.data?.map((item) => (
                          <SelectItem value={item.id.toString()} key={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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

          {/* <FormField
              control={form.control}
              name="isDomestic"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
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
            /> */}

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

      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm" id="table">
        <CommonTable
          data={query.data?.data}
          table={table}
          isLoading={provinceQuery.isFetching || query.isFetching}
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
    </>
  );
};

export default ReportLawyerCert;
