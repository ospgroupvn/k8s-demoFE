"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import DetailChangeHistorySystemLogModal from "@/components/admin/lich_su_he_thong/detailChangeHistorySystemLogModal";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QUERY_KEY } from "@/constants/common";
import { formatUserLocalTime } from "@/lib/utils";
import { searcHistorySystemListData } from "@/service/admin";
import { HistorySystemListItem, HistorySystemParams } from "@/types/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const DEFAULT_NUMBER_PER_PAGE = 10;

const formSchema = z.object({
  input: z.string().trim().optional(),
});

const HistorySystemPage = () => {
  const [open, setOpen] = useState(false);
  const [idOfRecord, setIdOfRecord] = useState("");

  const [searchParam, setSearchParam] = useState<HistorySystemParams>({
    pageNumber: 1,
    numberPerPage: DEFAULT_NUMBER_PER_PAGE,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const queryDataReturn = useQuery({
    queryKey: [QUERY_KEY.ADMIN.HISTORY_SYSTEM, searchParam],
    queryFn: searcHistorySystemListData,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<HistorySystemListItem>[] = [
    {
      accessorKey: "objectName",
      header: () => {
        return <div className="text-center">Đối tượng</div>;
      },
      cell: ({ row }) => {
        return <div>{row.original.objectName}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => {
        return <div className="text-center">Hành động</div>;
      },
      cell: ({ row }) => {
        return <div>{row.original.actions}</div>;
      },
    },
    {
      accessorKey: "createByStr",
      header: () => {
        return <div className="text-center">Người thực hiện</div>;
      },
      cell: ({ row }) => {
        return <div>{row.original.createByStr}</div>;
      },
    },
    {
      accessorKey: "genDate",
      header: () => {
        return <div className="text-center">Thời gian</div>;
      },
      cell: ({ row }) => {
        return <div>{formatUserLocalTime(row.original.genDate ?? 0)}</div>;
      },
    },
    {
      accessorKey: "ip",
      header: () => {
        return <div className="text-center">IP</div>;
      },
      cell: ({ row }) => {
        return <div>{row.original.ip}</div>;
      },
    },
    // {
    //   accessorKey: "chuc_nang",
    //   header: () => {
    //     return <div className="text-center">Chức năng</div>;
    //   },
    //   cell: ({ row }) => {
    //     return (
    //       <div
    //         className="text-center underline cursor-pointer"
    //         onClick={(event) => {
    //           setIdOfRecord((row.original?.id || "")?.toString());
    //           setOpen(true);

    //           event.preventDefault();
    //           event.stopPropagation();
    //         }}
    //       >
    //         Xem chi tiết
    //       </div>
    //     );
    //   },
    // },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: queryDataReturn.data?.data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: searchParam.numberPerPage || DEFAULT_NUMBER_PER_PAGE,
      },
    },
  });

  const dataForTableAndPagination = useMemo(() => {
    return {
      items: queryDataReturn.data?.data || [],
      numberPerPage: searchParam.numberPerPage || 10,
      pageNumber: searchParam.pageNumber || 1,
      pageList: Array.from(
        { length: queryDataReturn.data?.totalPage || 1 },
        (_, i) => i + 1
      ),
      total: queryDataReturn.data?.totalItem || 0,
      pageCount: queryDataReturn.data?.totalPage || 0,
    };
  }, [
    queryDataReturn.data?.data,
    queryDataReturn.data?.totalItem,
    queryDataReturn.data?.totalPage,
    searchParam.numberPerPage,
    searchParam.pageNumber,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchParam((prev) => {
      return {
        ...prev,
        pageNumber: 1,
        input: values?.input?.trim(),
      };
    });
  };

  useEffect(() => {
    if (queryDataReturn?.data?.data && form?.formState?.submitCount > 1) {
      document.getElementById("table")?.parentElement?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [form?.formState?.submitCount, queryDataReturn?.data?.data]);

  return (
    <>
      <h1 className="text-lg font-bold mb-6">LỊCH SỬ HỆ THỐNG</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-x-8 gap-y-1 items-center bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col mb-4">
                  <FormLabel className="font-bold">Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập Tên tài khoản để tìm kiếm"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          ></FormField>

          <div className="flex flex-col col-span-3">
            <div className="flex justify-center space-x-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-[136px] border border-[#222222]"
                onClick={() => {
                  form.reset();
                  form.handleSubmit(onSubmit)();
                }}
              >
                Xóa điều kiện
              </Button>
              <Button type="submit" className="w-[136px] bg-default-blue">
                Tìm kiếm
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm" id="table">
        <CommonTable
          data={dataForTableAndPagination}
          table={table}
          isLoading={queryDataReturn.isFetching}
          actions={[]}
        ></CommonTable>

        <CommonPagination
          data={dataForTableAndPagination}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      <DetailChangeHistorySystemLogModal
        open={open}
        setOpen={setOpen}
        idOfRecord={idOfRecord}
        setIdOfRecord={setIdOfRecord}
      />
    </>
  );
};

export default HistorySystemPage;
