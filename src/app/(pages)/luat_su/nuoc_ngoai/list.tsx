"use client";

import AutoCompleteSearch from "@/components/common/autoCompleteSearch";
import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import ConfirmModal from "@/components/common/confirmModal";
import LawyerDetailModalAdmin from "@/components/luat_su/lawyerDetailModalAdmin";
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
import { ACTIVITY_STATUS } from "@/constants/luat_su";
import { getListProvince } from "@/service/common";
import {
  deleteLawyer,
  getLawyerByIdPrivate,
  searchLawyerPrivate,
} from "@/service/lawyer";
import { LawyerItemPrivate, LawyerParamsPrivate } from "@/types/luatSu";
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

const LawyerForeignList = () => {
  const [searchParam, setSearchParam] = useState<LawyerParamsPrivate>({
    pageNumber: 1,
    numberPerPage: 10,
    isDomestic: 0,
  });
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<LawyerItemPrivate | undefined>(
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
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.LUAT_SU.LUAT_SU, searchParam],
    queryFn: searchLawyerPrivate,
    refetchOnWindowFocus: false,
  });

  const detailQuery = useMutation({
    mutationFn: getLawyerByIdPrivate,
  });

  const deleteMutation = useMutation({ mutationFn: deleteLawyer });

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

  const columns: ColumnDef<LawyerItemPrivate>[] = [
    {
      accessorKey: "name",
      header: "Họ tên",
      cell: ({ row }) => (
        <div
          className="text-left max-sm:whitespace-nowrap text-default-blue cursor-pointer"
          onClick={() => {
            setIsEdit(false);
            setIsAdd(false);
            detailQuery.mutate(row.original.id);
            setOpen(true);
          }}
        >
          {row.original.fullName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Ngày sinh",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.dateOfBirth
            ? format(row.original.dateOfBirth, "dd/MM/yyyy")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "nationality",
      header: "Quốc tịch",
      cell: ({ row }) => (
        <div className="text-left">{row.original.nationalName || "-"}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Nơi hành nghề/làm việc",
      cell: ({ row }) => (
        <div className="text-left max-sm:max-w-[200px] max-sm:w-max max-sm:line-clamp-3">
          {row.original.organizationName || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Tình trạng hành nghề",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {ACTIVITY_STATUS.find(
            (item) => item.value === row.original.activeStatus
          )?.label || "-"}
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
              setIsAdd(false);
              setIsEdit(true);
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

  const handleDeleteLawyer = (id?: number) => {
    if (id) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Xóa Luật sư thành công!");
          query.refetch();
          setIsShowConfirmModal(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Xóa Luật sư thất bại!");
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
      ...(values?.name ? { fullName: values.name } : {}),
      provinceId: values.org,
      listStatus: values.status ? [Number(values.status)] : undefined,
    }));
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6">DANH SÁCH LUẬT SƯ NƯỚC NGOÀI</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-x-8 gap-y-1 items-center"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Tên tổ chức</FormLabel>
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
                  Trạng thái hành nghề
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
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="4" key={4}>
                          Đang hành nghề
                        </SelectItem>
                        <SelectItem value="6" key={6}>
                          Đã thu hồi giấy phép
                        </SelectItem>
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
          isLoading={provinceQuery.isFetching || query.isFetching}
          actions={[
            <Button
              type="button"
              key="add"
              className="bg-default-blue hover:bg-default-blue/80"
              onClick={() => {
                setIsAdd(true);
                setIsEdit(true);
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

      <LawyerDetailModalAdmin
        data={detailQuery?.data?.data}
        open={open}
        setOpen={setOpen}
        isLoading={detailQuery.isPending}
        provinces={provinceQuery?.data?.data || []}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
        isDomestic={0}
        refetch={() => query.refetch()}
      />

      {isShowConfirmModal ? (
        <ConfirmModal
          title="Xác nhận xóa Luật sư"
          isLoading={deleteMutation.isPending}
          actionLabel="Xóa"
          secondaryActionLabel="Hủy"
          disabled={false}
          isOpen={isShowConfirmModal}
          onClose={() => setIsShowConfirmModal(false)}
          onSubmit={() => handleDeleteLawyer(currentItem?.id)}
          secondaryAction={() => setIsShowConfirmModal(false)}
          isShowActionButton={currentItem ? true : false}
          body={
            <>
              Bạn có chắc chắn muốn xóa Luật sư{" "}
              <strong>{currentItem?.fullName}?</strong>
            </>
          }
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default LawyerForeignList;
