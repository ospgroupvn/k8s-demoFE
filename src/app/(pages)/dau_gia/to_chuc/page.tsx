"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import AuctionOrgDetailModal from "@/components/dau_gia/auctionOrgDetailModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEY } from "@/constants/common";
import { AUCTION_ORG_TYPE, ORG_STATUS } from "@/constants/dauGia";
import {
  getAllOrganization,
  getAllOrganizationAuction,
  getAuctionOrgById,
} from "@/service/auctionOrg";
import { AuctionOrgItem, AuctionOrgParams } from "@/types/dauGia";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  text: z.string().trim().optional(),
  "department-code": z.string().trim().optional(),
  status: z.string().trim().optional(),
  type: z.array(z.string().trim()).optional(),
});

const Organization = () => {
  const [searchParam, setSearchParam] = useState<AuctionOrgParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP, "deprecated"],
    queryFn: () => getAllOrganization(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.TO_CHUC, searchParam],
    queryFn: () => getAllOrganizationAuction(searchParam),
    refetchOnWindowFocus: false,
  });

  const detailQuery = useMutation({
    mutationFn: getAuctionOrgById,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      "department-code": "",
      type: AUCTION_ORG_TYPE.map((item) => item.value.toString()),
      status: "",
    },
  });

  useEffect(() => {
    if (query?.data?.data && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data]);

  const columns: ColumnDef<AuctionOrgItem>[] = [
    {
      accessorKey: "departmentName",
      header: "Sở Tư pháp",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.province ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "fullname",
      header: "Tên tổ chức đấu giá",
      cell: ({ row }) => (
        <div className="text-left line-clamp-3 max-sm:min-w-[200px] min-w-[300px] text-default-blue cursor-pointer whitespace-normal">
          {row.original.id ? (
            <Link href={`/dau_gia/to_chuc/${row.original.id}`}>
              {row.original.fullname ?? "-"}
            </Link>
          ) : (
            (row.original.fullname ?? "-")
          )}
        </div>
      ),
    },
    {
      accessorKey: "auctioneerName",
      header: "Người đại diện theo pháp luật",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max">
          {row.original.auctioneerName ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở",
      cell: ({ row }) => (
        <div className="text-left max-sm:min-w-[150px] max-sm:w-max min-w-[300px] whitespace-normal line-clamp-3">
          {row.original.address ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.status === 16
            ? "Tạm ngừng hoạt động"
            : ORG_STATUS.find((item) => item.value === row.original.status)
                ?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "quantityAuctioneer",
      header: "Số ĐGV",
      cell: ({ row }) => <div>{row.original.quantityAuctioneer ?? "-"}</div>,
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
    const { type, status, text, "department-code": departmentCode } = values;
    setSearchParam((prev) => ({
      ...prev,
      name: text || undefined,
      cityId: departmentCode ? Number(departmentCode) : undefined,
      status: status ? Number(status) : undefined,
      orgType: type?.length ? type.join(",") : undefined,
      pageNumber: 1,
      numberPerPage: prev.numberPerPage,
    }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">
        DANH SÁCH TỔ CHỨC HÀNH NGHỀ ĐẤU GIÁ
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-x-8 gap-y-1 items-center bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Tổ chức đấu giá</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên tổ chức đấu giá" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department-code"
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
                    options={orgQuery?.data?.data || []}
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
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Loại hình tổ chức</FormLabel>
                <FormControl>
                  <MultiSelect
                    allowSelectAll
                    placeholder="Chọn Loại hình tổ chức"
                    value={field.value}
                    data={AUCTION_ORG_TYPE.map((item) => ({
                      value: item?.value?.toString() || "",
                      label: item.label,
                    }))}
                    onChange={(values) => {
                      form.setValue(
                        "type",
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
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">
                  Trạng thái hoạt động
                </FormLabel>
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup className="overflow-y-auto max-h-[200px]">
                      <SelectItem value="all">Tất cả</SelectItem>
                      {ORG_STATUS.map((item) => (
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
          isLoading={orgQuery.isFetching || query.isFetching}
          // actions={[
          //   <Button
          //     key="add"
          //     className="bg-default-blue hover:bg-default-blue/80"
          //     onClick={() => router.push("/dau_gia/to_chuc/them_moi")}
          //   >
          //     + Thêm mới
          //   </Button>,
          // ]}
        />

        <CommonPagination
          data={query.data?.data}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      <AuctionOrgDetailModal
        data={detailQuery?.data?.data}
        open={open}
        setOpen={setOpen}
        isLoading={detailQuery?.isPending}
      />
    </>
  );
};

export default Organization;
