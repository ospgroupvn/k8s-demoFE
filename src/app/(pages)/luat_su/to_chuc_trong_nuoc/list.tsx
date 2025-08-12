"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import ConfirmModal from "@/components/common/confirmModal";
import LawyerOrgDetailModalAdmin from "@/components/luat_su/lawyerOrgDetailModalAdmin";
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
import { LAWYER_STATUS } from "@/constants/luat_su";
import { getListProvince } from "@/service/common";
import {
  deleteLawyerOrg,
  getLawyerOrgByIdPrivate,
  searchLawyerOrgPrivate,
} from "@/service/lawyer";
import { LawyerOrgItem, LawyerOrgParamsPrivate } from "@/types/luatSu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().optional(),
  org: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

const LawyerOrgDomesticList = () => {
  const [searchParam, setSearchParam] = useState<LawyerOrgParamsPrivate>({
    pageNumber: 1,
    numberPerPage: 10,
    isDomestic: 1,
  });
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<LawyerOrgItem | undefined>(
    undefined
  );
  const session = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      org: "",
      status: "",
    },
  });

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE, "lawyer"],
    queryFn: () => getListProvince(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.TO_CHUC_TRONG_NUOC, searchParam],
    queryFn: searchLawyerOrgPrivate,
    refetchOnWindowFocus: false,
  });

  const detailQuery = useMutation({
    mutationFn: getLawyerOrgByIdPrivate,
  });

  const deleteMutation = useMutation({ mutationFn: deleteLawyerOrg });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  const columns: ColumnDef<LawyerOrgItem>[] = [
    {
      accessorKey: "orgName",
      header: "Tên tổ chức hành nghề",
      cell: ({ row }) => (
        <div
          className="text-left max-sm:whitespace-nowrap text-default-blue cursor-pointer"
          onClick={() => {
            setIsEdit(false);
            setCurrentId(row.original.id);
            detailQuery.mutate(row.original.id);
            setOpen(true);
          }}
        >
          {row.original.orgName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="text-left">{row.original.phone || "-"}</div>
      ),
    },
    {
      accessorKey: "registrationLicenseNumber",
      header: "Số giấy ĐKHĐ",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.registrationLicenseNumber || "-"}
        </div>
      ),
    },
    {
      accessorKey: "businessLicenseIssueDate",
      header: "Ngày cấp",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.businessLicenseIssueDate
            ? new Date(
                row.original.businessLicenseIssueDate
              ).toLocaleDateString("vi-VN")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ trụ sở",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.address || "-"}
        </div>
      ),
    },
    {
      accessorKey: "lawyerLegalRepresentativeName",
      header: "Người đại diện theo pháp luật",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.lawyerLegalRepresentativeName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái hoạt động",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {LAWYER_STATUS.find((item) => row.original.status === item.value)
            ?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Chức năng",
      cell: ({ row }) => (
        <div className="flex space-x-2 justify-center items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsEdit(true);
              setIsAdd(false);
              setCurrentId(row.original.id);
              detailQuery.mutate(row.original.id);
              setOpen(true);
            }}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={() => {
              setCurrentItem(row.original);
              setIsShowConfirmModal(true);
            }}
          >
            <Trash2 />{" "}
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteOrg = (id?: number) => {
    if (id) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Xóa Tổ chức thành công!");
          query.refetch();
          setIsShowConfirmModal(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Xóa Tổ chức thất bại!");
        },
      });
    }
  };

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
      ...(values?.name ? { orgName: values.name } : {}),
      provinceId: values.org,
      listStatus: values.status ? [Number(values.status)] : undefined,
    }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">
        DANH SÁCH TỔ CHỨC HÀNH NGHỀ LUẬT SƯ TRONG NƯỚC
      </h1>

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
                <FormLabel className="font-bold">Tìm kiếm theo tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập vào tên để tìm kiếm" {...field} />
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
                  <FormLabel className="font-bold">Tỉnh/Thành phố</FormLabel>
                  <FormControl>
                    <AutoCompleteSearch
                      disabled={
                        session.data?.user?.type === USER_TYPE.SO_TU_PHAP
                      }
                      displayKey="name"
                      selectPlaceholder="Chọn Tỉnh/Thành phố"
                      emptyMsg="Không tìm thấy dữ liệu"
                      onSelect={(value) => {
                        field.onChange(value.id?.toString() || "");
                      }}
                      optionKey="id"
                      options={provinceQuery?.data?.data || []}
                      placeholder="Tìm kiếm theo tên Tỉnh/Thành phố"
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
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">
                  Trạng thái hoạt động
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value === "all") {
                        field.onChange("");
                        return;
                      }
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        {LAWYER_STATUS.map((item) => (
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

      <div className="mt-4 bg-white p-4 shadow-sm rounded-lg" id="table">
        <CommonTable
          data={query.data?.data}
          table={table}
          isLoading={provinceQuery.isFetching || query.isFetching}
          actions={[
            <Button
              type="button"
              key="add"
              className="bg-default-blue hover:bg-default-blue/80"
              onClick={() => {
                setIsEdit(true);
                setIsAdd(true);
                setOpen(true);
              }}
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

      <LawyerOrgDetailModalAdmin
        data={detailQuery?.data?.data}
        open={open}
        setOpen={setOpen}
        isLoading={detailQuery.isPending}
        provinces={provinceQuery?.data?.data || []}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
        isDomestic={1}
        refetch={() => detailQuery.mutate(currentId!)}
        refetchList={() => query.refetch()}
      />

      {isShowConfirmModal ? (
        <ConfirmModal
          title="Xác nhận xóa Tổ chức Luật sư"
          isLoading={deleteMutation.isPending}
          actionLabel="Xóa"
          secondaryActionLabel="Hủy"
          disabled={false}
          isOpen={isShowConfirmModal}
          onClose={() => setIsShowConfirmModal(false)}
          onSubmit={() => handleDeleteOrg(currentItem?.id)}
          secondaryAction={() => setIsShowConfirmModal(false)}
          isShowActionButton={currentItem ? true : false}
          body={
            <>
              Bạn có chắc chắn muốn xóa Tổ chức{" "}
              <strong>{currentItem?.orgName}?</strong>
            </>
          }
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default LawyerOrgDomesticList;
