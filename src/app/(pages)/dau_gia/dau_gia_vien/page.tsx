"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import DGVDetailModal from "@/components/dau_gia/auctionDgvDetailModal";
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
import { QUERY_KEY } from "@/constants/common";
import { AUCTION_CARD_STATUS, CER_STATUS } from "@/constants/dauGia";
import {
  exportAuctioneer,
  getAllOrganization,
  getAllOrganizationAuction,
  getDGVById,
  searchAuctioneer,
} from "@/service/auctionOrg";
import {
  AuctioneerItem,
  AuctioneerParams,
  AuctioneerParamsPrivate,
} from "@/types/dauGia";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().optional(),
  department: z.string().trim().optional(),
  organization: z.string().trim().optional(),
  certStatus: z.string().trim().optional(),
  cardStatus: z.string().trim().optional(),
});

const Auctioneer = () => {
  const [searchParam, setSearchParam] = useState<AuctioneerParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      organization: "",
      certStatus: "",
      cardStatus: "",
    },
  });

  const departmentQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP, "deprecated"],
    queryFn: () => getAllOrganization(),
    refetchOnWindowFocus: false,
  });

  // Infinite query for organization selector
  const [orgSearch, setOrgSearch] = useState("");

  const {
    data: orgData,
    isLoading: orgIsLoading,
    fetchNextPage: orgFetchNextPage,
    hasNextPage: orgHasNextPage,
    isFetchingNextPage: orgIsFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.DAU_GIA.TO_CHUC, orgSearch],
    queryFn: ({ pageParam = 1 }) =>
      getAllOrganizationAuction({
        name: orgSearch || undefined,
        pageNumber: pageParam,
        numberPerPage: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const currentPage = lastPageParam || 1;
      const totalPages = lastPage?.data?.pageCount || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const orgList = useMemo(() => {
    return orgData?.pages?.flatMap((page) => page?.data?.items || []) || [];
  }, [orgData]);

  const handleOrgLazySearch = useCallback((value: string) => {
    setOrgSearch(value);
  }, []);

  const query = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.DAU_GIA_VIEN, searchParam],
    queryFn: searchAuctioneer,
    enabled: !!departmentQuery?.data?.data?.length,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  // const orgQuery = useQuery({
  //   queryKey: [QUERY_KEY.DAU_GIA.DOANH_NGHIEP, "all"],
  //   queryFn: () =>
  //     getListAuctionOrg(
  //       "",
  //       AUCTION_ORG_TYPE_PRIVATE.map((item) => item.value)
  //     ),
  //   refetchOnWindowFocus: false,
  // });

  const detailQuery = useMutation({
    mutationFn: getDGVById,
  });

  useEffect(() => {
    if (query?.data?.data && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data]);

  const exportExcel = useMutation({
    mutationFn: (params: AuctioneerParamsPrivate) => exportAuctioneer(params),
    onSuccess: (response) => {
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const filename = "danh_sach_dau_gia_vien.xlsx"; // default filename

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

  const columns: ColumnDef<AuctioneerItem>[] = [
    {
      accessorKey: "fullname",
      header: "Họ và tên",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max">
          <Link
            href={`/dau_gia/dau_gia_vien/${row.original.id}`}
            className="text-default-blue"
          >
            {row.original.fullname}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "cerCode",
      header: "Số chứng chỉ hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.cerCode || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Năm sinh",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.dob || "-"}
        </div>
      ),
    },
    {
      accessorKey: "orgName",
      header: "Tổ chức đấu giá đang hành nghề",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max">
          {row.original.orgName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "deptName",
      header: "Sở Tư pháp",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max">
          {row.original.deptName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "deptAddress",
      header: "Địa chỉ Sở Tư pháp",
      cell: ({ row }) => (
        <div className="text-left min-w-[300px] line-clamp-3 whitespace-normal">
          {row.original.deptAddress || "-"}
        </div>
      ),
    },
    {
      accessorKey: "cerStatus",
      header: "Trạng thái CCHN",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {CER_STATUS.find((item) => item.value === row.original.cerStatus)
            ?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái thẻ ĐGV",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {AUCTION_CARD_STATUS.find(
            (item) => item.value === row.original.cardStatus
          )?.label || "-"}
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
      fullname: values.name,
      cerStatus: values.certStatus ? Number(values.certStatus) : undefined,
      orgId: values.organization ? Number(values.organization) : undefined,
      province: values.department ? Number(values.department) : undefined,
      cardStatus: values.cardStatus ? Number(values.cardStatus) : undefined,
    }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">DANH SÁCH ĐẤU GIÁ VIÊN</h1>

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
                <FormLabel className="font-bold">Đấu giá viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập vào tên để tìm kiếm" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Sở Tư pháp</FormLabel>
                <FormControl>
                  <AutoCompleteSearch
                    displayKey="fullName"
                    selectPlaceholder="Tất cả"
                    emptyMsg="Không tìm thấy dữ liệu"
                    onSelect={(value) => {
                      field.onChange(value?.cityId?.toString() || "");
                    }}
                    optionKey="cityId"
                    options={departmentQuery?.data?.data || []}
                    placeholder="Tìm kiếm theo tên Sở Tư pháp"
                    value={field.value || ""}
                    valueKey="cityId"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Tổ chức đấu giá</FormLabel>
                <FormControl>
                  <AutoCompleteSearch
                    displayKey="fullname"
                    selectPlaceholder="Chọn tổ chức đấu giá"
                    emptyMsg="Không tìm thấy dữ liệu"
                    onSelect={(value) => {
                      field.onChange(value?.id?.toString() || "");
                    }}
                    optionKey="id"
                    options={orgList}
                    placeholder="Tìm kiếm theo tên tổ chức đấu giá"
                    value={field.value || ""}
                    valueKey="id"
                    isLoading={orgIsLoading || orgIsFetchingNextPage}
                    onScrollLoad={orgHasNextPage ? orgFetchNextPage : undefined}
                    onLazyLoadingSearch={handleOrgLazySearch}
                    inputDebounce={300}
                    showSearch={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certStatus"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Trạng thái CCHN</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "all") {
                        field.onChange("");
                      } else {
                        field.onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái CCHN" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {CER_STATUS.map((item) => (
                          <SelectItem
                            value={item.value.toString()}
                            key={item.value}
                          >
                            {item.label}
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
            name="cardStatus"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Trạng thái thẻ ĐGV</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "all") {
                        field.onChange("");
                      } else {
                        field.onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái thẻ ĐGV" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {AUCTION_CARD_STATUS.map((item) => (
                          <SelectItem
                            value={item.value.toString()}
                            key={item.value}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

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
          isLoading={departmentQuery.isFetching || query.isFetching}
          // actions={
          //   [
          // <Button
          //   key="export"
          //   className="bg-green-500 hover:bg-green-500/50"
          //   onClick={() => exportExcel.mutate(searchParams)
          //   disabled={exportExcel.isPending}
          // >
          //   Xuất danh sách
          // </Button>,
          // <Button
          //   key="add"
          //   className="bg-default-blue hover:bg-default-blue/80"
          //   onClick={() => router.push("/dau_gia/dau_gia_vien/them_moi")}
          // >
          //   + Thêm mới
          // </Button>,
          //   ]f
          // }
        />

        <CommonPagination
          data={query.data?.data}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      <DGVDetailModal
        data={detailQuery?.data?.data}
        open={open}
        setOpen={setOpen}
        isLoading={detailQuery?.isPending}
      />
    </>
  );
};

export default Auctioneer;
