"use client";

import CommonPagination from "@/components/common/commonPagination";
import CommonTable from "@/components/common/commonTable";
import ConfirmModal from "@/components/common/confirmModal";
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
import {
  PAGE_NUMBER,
  QUERY_KEY,
  USER_TYPE,
  USER_TYPE_LIST,
} from "@/constants/common";
import { hasOneOfPermissions, hasPermission } from "@/lib/utils";
import { deleteGroup, searchUserGroup } from "@/service/admin";
import { UserGroupItem, UserGroupParams } from "@/types/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FileEdit, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  filterName: z.string().trim().optional(),
  type: z.string().trim().optional(),
});

const UserGroup = () => {
  const [searchParam, setSearchParam] = useState<UserGroupParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
  const [currentGroup, setCurrentGroup] = useState<UserGroupItem | undefined>(
    undefined
  );
  const session = useSession();
  const router = useRouter();

  // Check quyền
  const canEdit = hasPermission(
    "ROLE_SYSTEM_GROUP_EDIT",
    session?.data?.user?.authorities || []
  );
  const canDelete = hasPermission(
    "ROLE_SYSTEM_GROUP_DELETE",
    session?.data?.user?.authorities || []
  );

  const query = useQuery({
    queryKey: [QUERY_KEY.ADMIN.USER_GROUP, searchParam],
    queryFn: searchUserGroup,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filterName: "",
      type: "",
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
      );

      handleCancelConfirmModal();
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`Xóa nhóm quyền ${currentGroup?.groupName} thành công!`);

        setSearchParam({ ...searchParam, pageNumber: PAGE_NUMBER });
        //   setShowUserGroupTable(false)
        //   if (currentGroup?.id === itemChecked?.id) {
        //     setItemChecked(undefined)
        //   }
        query.refetch();
      } else {
        toast.error(res?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      }
      handleCancelConfirmModal();
    },
  });

  useEffect(() => {
    if (query?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.items]);

  const columns: ColumnDef<UserGroupItem>[] = [
    {
      accessorKey: "name",
      header: () => <div className="min-w-[120px]">Tên nhóm quyền</div>,
      cell: ({ row }) => (
        <div className="text-left">
          <div>{row.original.groupName || "-"}</div>
          {row.original?.isDefault ? (
            <div className="px-2 py-1 bg-[#DBEAFE] text-[#11479C] font-semibold text-xs w-fit">
              Mặc định
            </div>
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="min-w-[120px]">Nhóm người dùng</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {USER_TYPE_LIST.find((item) => item.value === row.original.type)
            ?.label || "-"}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div className="min-w-[120px]">Mô tả</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.description || "-"}</div>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      enableHiding: !hasOneOfPermissions(
        ["ROLE_SYSTEM_GROUP_DELETE", "ROLE_SYSTEM_GROUP_EDIT"],
        session?.data?.user?.authorities || []
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-center gap-x-2">
            {canEdit && (
              <Button
                type="button"
                variant="outline"
                className="w-fit font-medium h-7 py-1 px-2 gap-x-2 border border-[#0C63E4] text-[#0C63E4] hover:text-[#0C63E4]"
                onClick={() => router.push(`/admin/nhom_quyen/edit/${item.id}`)}
              >
                <FileEdit />
                Sửa
              </Button>
            )}
            {canDelete && (
              <Button
                type="button"
                variant="outline"
                className="w-fit font-medium h-7 py-1 px-2 gap-x-2 border border-[#DB3B00] text-[#DB3B00] hover:text-[#DB3B00]"
                onClick={() => {
                  setCurrentGroup(item);
                  setIsShowConfirmModal(true);
                }}
              >
                <Trash />
                Xóa
              </Button>
            )}
          </div>
        );
      },
      size: 20,
      minSize: 20,
    },
  ];

  const table = useReactTable({
    manualPagination: true,
    data: query.data?.items || [],
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
      filterName: values.filterName || "",
      type:
        values?.type && values?.type !== "all"
          ? Number(values.type)
          : undefined,
    }));
  };

  // if (
  //   session.status === "unauthenticated" ||
  //   (session.status === "authenticated" &&
  //     session.data.user?.type !== USER_TYPE.ADMIN)
  // ) {
  //   redirect("/");
  // }

  const handleCancelConfirmModal = () => {
    setIsShowConfirmModal(false);
    setCurrentGroup(undefined);
  };

  const handleSubmitConfirmModal = () => {
    if (currentGroup) {
      deleteGroupMutation.mutate(currentGroup);
    }
  };

  const addButton = () => {
    return (
      <Link href="/admin/nhom_quyen/add">
        <Button
          type="button"
          className="bg-default-blue border border-default-blue hover:text-default-blue hover:bg-white"
        >
          Thêm mới
        </Button>
      </Link>
    );
  };

  redirect("/")

  return (
    <>
      <h1 className="text-lg font-bold mb-6 uppercase">QUẢN LÝ NHÓM QUYỀN</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-x-8 gap-y-1 items-center"
        >
          <FormField
            control={form.control}
            name="filterName"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Tên nhóm quyền</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập vào tên để tìm kiếm" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 max-sm:col-span-3">
                <FormLabel className="font-bold">Loại người dùng</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="overflow-y-auto max-h-[200px]">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {USER_TYPE_LIST.map((item) => (
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

      <div className="mt-4" id="table">
        <CommonTable
          data={query.data}
          table={table}
          isLoading={query.isFetching}
          actions={[addButton()]}
        />

        <CommonPagination
          data={query.data}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      {isShowConfirmModal && (
        <ConfirmModal
          title="Xác nhận xóa nhóm quyền"
          secondaryActionLabel="Hủy"
          disabled={false}
          isOpen={isShowConfirmModal}
          onClose={handleCancelConfirmModal}
          onSubmit={handleSubmitConfirmModal}
          secondaryAction={handleCancelConfirmModal}
          isShowActionButton={currentGroup ? true : false}
          body={
            <>
              Bạn có chắc chắn muốn xóa{" "}
              <strong>{currentGroup?.groupName}?</strong>
            </>
          }
        />
      )}
    </>
  );
};

export default UserGroup;
