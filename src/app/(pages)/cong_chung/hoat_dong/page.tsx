"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import NotaryOperationDeleteModal from "@/components/cong_chung/notaryOperationDeleteModal";
import NotaryOperationModal from "@/components/cong_chung/notaryOperationModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { QUERY_KEY } from "@/constants/common";
import { hasPermission } from "@/lib/utils";
import { getAllOrganization } from "@/service/auctionOrg";
import { searchNotaryOperation } from "@/service/notaryOrg";
import { NotaryOperationItem, NotaryOperationParams } from "@/types/congChung";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getYear } from "date-fns";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEditNote } from "react-icons/md";
import { z } from "zod";

const formSchema = z.object({
  yearReport: z
    .string()
    .trim()
    .refine((val) => val.length > 0, { message: "Vui lòng chọn năm" }),
  monthReport: z.array(z.string()).optional(),
  cityId: z.string().trim().optional(),
});

const NotaryOperation = () => {
  const session = useSession();
  const currentYear = getYear(new Date());
  const [searchParam, setSearchParam] = useState<NotaryOperationParams>({
    pageNumber: 1,
    numberPerPage: 10,
    yearReport: currentYear,
  });
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<
    NotaryOperationItem | undefined
  >(undefined);

  // Check quyền
  const canAdd = hasPermission(
    "ROLE_NOTARY_ACTIVITY_ADD",
    session.data?.user?.authorities || []
  );

  const canEdit = hasPermission(
    "ROLE_NOTARY_ACTIVITY_EDIT",
    session.data?.user?.authorities || []
  );

  const canDelete = hasPermission(
    "ROLE_NOTARY_ACTIVITY_DELETE",
    session.data?.user?.authorities || []
  );

  if (
    !hasPermission(
      "ROLE_NOTARY_ACTIVITY_VIEW",
      session.data?.user?.authorities || []
    )
  ) {
    redirect("/trang_chu");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearReport: currentYear.toString(),
      monthReport: [],
      cityId: "",
    },
  });

  const orgQuery = useQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP, "deprecated"],
    queryFn: () => getAllOrganization(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.CONG_CHUNG.OPERATION, searchParam],
    queryFn: searchNotaryOperation,
    enabled: !!orgQuery?.data?.data?.length,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  const columns: ColumnDef<NotaryOperationItem>[] = [
    {
      accessorKey: "month",
      header: "Tháng",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max whitespace-nowrap">
          Tháng {row.original.reportMonth}
        </div>
      ),
    },
    {
      accessorKey: "parentOrg",
      header: "Tỉnh/Thành phố",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[150px] max-sm:w-max whitespace-nowrap">
          {row.original.province?.replace("Sở Tư pháp ", "")}
        </div>
      ),
    },
    {
      accessorKey: "jobContract",
      header: "Số công việc công chứng hợp đồng, giao dịch",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {row.original.numNotaryContracts}
        </div>
      ),
    },
    {
      accessorKey: "jobContractPay",
      header: "Phí công chứng",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {(row.original.notaryFeesContracts || 0).toLocaleString("vi-VN")}
        </div>
      ),
    },
    {
      accessorKey: "jobTranslate",
      header: "Giá dịch vụ công chứng và chi",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {row.original.numOtherNotaryTasks}
        </div>
      ),
    },
    {
      accessorKey: "jobTranslatePay",
      header: "Thù lao công việc công chứng bản dịch và các loại khác",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {(row.original.notaryFeesOtherTasks || 0).toLocaleString("vi-VN")}
        </div>
      ),
    },
    {
      accessorKey: "totalJob",
      header: "Tổng số công việc công chứng đã thực hiện",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {row.original.totalTasks}
        </div>
      ),
    },
    {
      accessorKey: "totalJobCCV",
      header: "Tổng số CCV đã thực hiện công việc",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {row.original.numNotariesWorking}
        </div>
      ),
    },
    {
      accessorKey: "totalPay",
      header: "Tổng số phí, giá dịch vụ công chứng và chi phí khác",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {(row.original.totalFees || 0).toLocaleString("vi-VN")}
        </div>
      ),
    },
    {
      accessorKey: "tax",
      header: "Số tiền nộp ngân sách nhà nước",
      cell: ({ row }) => (
        <div className="max-sm:max-w-[150px] max-sm:w-max min-w-[150px]">
          {(row.original.taxContribution || 0).toLocaleString("vi-VN")}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Chức năng",
      enableHiding: !canEdit && !canDelete,
      cell: ({ row }) => (
        <div className="flex gap-x-4">
          {canEdit ? (
            <MdEditNote
              size={24}
              className="cursor-pointer"
              onClick={() => {
                setCurrentItem(row.original);
                setOpen(true);
              }}
            />
          ) : (
            <></>
          )}
          {canDelete ? (
            <MdDelete
              color="red"
              size={24}
              className="cursor-pointer"
              onClick={() => {
                setCurrentItem(row.original);
                setDeleteOpen(true);
              }}
            />
          ) : (
            <></>
          )}
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
      ...(values.monthReport?.length
        ? { monthReport: values.monthReport }
        : {}),
      cityId: values.cityId ? Number(values.cityId) : undefined,
      yearReport: values.yearReport ? Number(values.yearReport) : undefined,
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold mb-6">
          DANH SÁCH HOẠT ĐỘNG CÔNG CHỨNG
        </h1>
        {canAdd ? (
          <Button
            type="button"
            className="bg-[#C3ECF5] text-default-blue hover:bg-white border border-[#C3ECF5]"
            onClick={() => {
              setCurrentItem(undefined);
              setOpen(true);
            }}
          >
            + Thêm mới
          </Button>
        ) : (
          <></>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-8 gap-x-2 gap-y-1 items-end max-sm:grid-cols-6"
        >
          <FormField
            control={form.control}
            name="yearReport"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                <FormLabel className="font-bold">Năm</FormLabel>
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthReport"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                <FormLabel className="font-bold">Tháng</FormLabel>
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left col-span-2 max-sm:col-span-6">
                <FormLabel className="font-bold">Tỉnh/Thành phố</FormLabel>
                <FormControl>
                  <AutoCompleteSearch
                    displayKey="fullName"
                    selectPlaceholder="Chọn Tỉnh/Thành phố"
                    emptyMsg="Không tìm thấy dữ liệu"
                    onSelect={(value) => {
                      field.onChange(value.cityCode?.toString() || "");
                    }}
                    optionKey="id"
                    options={orgQuery?.data?.data || []}
                    placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
                    value={field.value || ""}
                    valueKey="cityCode"
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
        </form>
      </Form>

      <div className="mt-4" id="table">
        <CommonTable
          data={query.data?.data}
          table={table}
          isLoading={orgQuery.isFetching || query.isFetching}
        />

        <CommonPagination
          data={query.data?.data}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      <NotaryOperationModal
        open={open}
        setOpen={setOpen}
        provinceList={orgQuery?.data?.data || []}
        item={currentItem}
        refetch={() => query.refetch()}
      />

      {deleteOpen && currentItem?.id ? (
        <NotaryOperationDeleteModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          item={currentItem}
          refetch={() => query.refetch()}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default NotaryOperation;
