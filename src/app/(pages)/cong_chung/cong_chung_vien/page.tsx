"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEY, USER_TYPE } from "@/constants/common";
import { STATUS_OPTIONS } from "@/constants/congChung";
import {
  exportNotaryEmplPrivate,
  getListNotaryAdministration,
  getNotaryOrgCategory,
  searchNotaryEmplPrivate,
} from "@/service/notaryOrg";
import { NotaryEmplItem, NotaryEmplParams } from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().optional(),
  org: z.string().trim().optional(),
  status: z.string().trim().optional(),
  managerOrg: z.string().trim().optional(),
});

const NotaryEmpl = () => {
  const [searchParam, setSearchParam] = useState<NotaryEmplParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();
  const router = useRouter();

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP, "private"],
    queryFn: () => getListNotaryAdministration(2),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.CONG_CHUNG_VIEN, searchParam],
    queryFn: searchNotaryEmplPrivate,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        QUERY_KEY.CONG_CHUNG.TO_CHUC,
        `category-infinite`,
        searchQuery,
      ],
      queryFn: ({ pageParam = 0 }) =>
        getNotaryOrgCategory({
          pageNo: pageParam,
          pageSize: 10,
          name: searchQuery || "",
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        const currentPage = lastPageParam || 0;
        const totalPages = lastPage?.totalPage || 1;
        return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
      },
    });

  const orgData = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data || []) || [];
  }, [data]);

  const handleLazySearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const exportExcel = useMutation({
    mutationFn: (params: NotaryEmplParams) => exportNotaryEmplPrivate(params),
    onSuccess: (response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Extract filename from Content-Disposition header
      let filename = "danh_sach_cong_chung_vien.xlsx"; // default filename

      if (response.filename) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(response.filename);
        if (matches != null && matches[1]) {
          // Remove quotes if present
          filename = matches[1].replace(/['""]/g, "");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      org: "",
      status: "",
    },
  });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  const columns: ColumnDef<NotaryEmplItem>[] = [
    { accessorKey: "nameAdmin", header: "Sở Tư pháp" },
    {
      accessorKey: "fullname",
      header: () => <div className="text-left">Họ và tên</div>,
      cell: ({ row }) => (
        <div className="text-left text-default-blue cursor-pointer min-w-[150px]">
          <Link
            href={`/cong_chung/cong_chung_vien/${row.original.idNotaryInfo}`}
          >
            {row.original.nameNotaryInfo}
          </Link>
        </div>
      ),
    },
    { accessorKey: "numberCad", header: "Số thẻ CCV" },
    { accessorKey: "idNo", header: "Số CMND/CCCD/Hộ chiếu" },
    {
      accessorKey: "org",
      header: "Tổ chức CCV đang hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.nameOrgNotaryInfo || "-"}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở tổ chức HNCC",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.orgNotaryAddress || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.statusNotaryInfoStr || "-"}
        </div>
      ),
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
        pageSize: searchParam.numberPerPage || 10,
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchParam((prev) => ({
      ...prev,
      pageNumber: 1,
      name: values.name,
      orgId: values.org ? Number(values.org) : undefined,
      status: values.status ? Number(values.status) : undefined,
      orgCode: values.managerOrg ? values.managerOrg.toString() : undefined,
    }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">DANH SÁCH CÔNG CHỨNG VIÊN</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-x-8 gap-y-1 items-center bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Công chứng viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập vào Họ tên, Số thẻ CCV" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {session.data?.user?.type !== USER_TYPE.SO_TU_PHAP ? (
            <FormField
              control={form.control}
              name="org"
              render={({ field }) => (
                <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                  <FormLabel className="font-bold">Sở Tư pháp</FormLabel>
                  <FormControl>
                    <AutoCompleteSearch
                      disabled={
                        session?.data?.user?.type === USER_TYPE.SO_TU_PHAP
                      }
                      displayKey="fullName"
                      selectPlaceholder="Tất cả"
                      emptyMsg="Không tìm thấy dữ liệu"
                      onSelect={(value) => {
                        field.onChange(value.id?.toString() || "");
                      }}
                      optionKey="id"
                      options={orgQuery?.data?.data || []}
                      placeholder="Tìm kiếm theo tên Sở Tư pháp"
                      value={field.value || ""}
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
            name="managerOrg"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Tổ chức hành nghề</FormLabel>
                <FormControl>
                  <AutoCompleteSearch
                    displayKey="name"
                    emptyMsg="Không tìm thấy Tổ chức"
                    optionKey="id"
                    valueKey="id"
                    placeholder="Tìm kiếm Tổ chức"
                    value={field.value?.toString() || ""}
                    options={orgData || []}
                    onSelect={(selectedOrg) => {
                      field.onChange(selectedOrg.id?.toString() || "");
                    }}
                    isLoading={isLoading || isFetchingNextPage}
                    onScrollLoad={hasNextPage ? fetchNextPage : undefined}
                    onLazyLoadingSearch={handleLazySearch}
                    selectPlaceholder="Tất cả"
                    defaultSelect={true}
                    triggerClassName="min-w-50"
                    showSearch={true}
                    inputDebounce={300}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">
                  Trạng thái hoạt động
                </FormLabel>
                <FormControl>
                  <AutoCompleteSearch
                    displayKey="label"
                    selectPlaceholder="Tất cả"
                    emptyMsg="Không tìm thấy trạng thái"
                    onSelect={(value) => {
                      field.onChange(value.value?.toString() || "");
                    }}
                    optionKey="value"
                    options={STATUS_OPTIONS}
                    placeholder="Tìm kiếm trạng thái"
                    value={field.value || ""}
                    valueKey="value"
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}

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
          data={query.data?.data}
          table={table}
          isLoading={orgQuery.isFetching || query.isFetching}
          actions={[
            <Button
              key="export"
              className="bg-green-500 hover:bg-green-500/50"
              onClick={() =>
                exportExcel.mutate({ ...searchParam, numberPerPage: 1000 })
              }
              disabled={exportExcel.isPending}
            >
              Xuất danh sách
            </Button>,
            <Button
              key="add"
              className="bg-default-blue hover:bg-default-blue/80"
              onClick={() =>
                router.push("/cong_chung/cong_chung_vien/them_moi")
              }
            >
              + Thêm mới
            </Button>,
          ]}
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

export default NotaryEmpl;
