"use client";

import AddUserModal from "@/components/admin/user/addUserModal";
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
import { QUERY_KEY, USER_TYPE_LIST } from "@/constants/common";
import { searchUser } from "@/service/admin";
import { getListProvince } from "@/service/common";
import { UserListItem, UserSearchParams } from "@/types/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().trim().optional(),
  fullName: z.string().trim().optional(),
  type: z.string().trim().optional(),
});

const UserList = () => {
  const [searchParam, setSearchParam] = useState<UserSearchParams>({
    pageNumber: 1,
    numberPerPage: 10,
  });
  const [open, setOpen] = useState(false);

  const provinceQuery = useQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE, "deprecated"],
    queryFn: () => getListProvince(),
    refetchOnWindowFocus: false,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.ADMIN.USER_LIST, searchParam],
    queryFn: searchUser,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      type: "",
    },
  });

  const columns: ColumnDef<UserListItem>[] = [
    {
      accessorKey: "username",
      header: () => <div className="text-left">Tên đăng nhập</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.username || "-"}</div>
      ),
    },
    {
      accessorKey: "fullName",
      header: () => <div className="text-left">Tên người dùng</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.fullName || "-"}</div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="text-left">Loại người dùng</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {USER_TYPE_LIST.find((item) => item.value === row.original.type)
            ?.label || ""}
        </div>
      ),
    },
    {
      accessorKey: "province",
      header: "Tỉnh/Thành phố",
      cell: ({ row }) => (
        <div className="text-left">
          {provinceQuery?.data?.data?.find(
            (item) => item.code === row.original.administrationId?.toString()
          )?.name || ""}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (query?.data?.data?.items && form?.formState?.submitCount > 1) {
      document
        .getElementById("table")
        ?.parentElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [form?.formState?.submitCount, query?.data?.data?.items]);

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
      ...values,
      pageNumber: 1,
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold mb-6 uppercase">Quản lý người dùng</h1>
        <Button
          type="button"
          className="bg-default-blue text-white hover:bg-default-blue/60 border border-default-blue"
          onClick={() => {
            setOpen(true);
          }}
        >
          + Thêm mới
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-6 gap-x-3 gap-y-1 items-start bg-white p-4 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 col-span-2 max-sm:col-span-6">
                <FormLabel className="font-bold">Tên tài khoản</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập vào tên để tìm kiếm" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex flex-col items-left mb-4 col-span-2 max-sm:col-span-6">
                <FormLabel className="font-bold">Tên người dùng</FormLabel>
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
              <FormItem className="flex flex-col items-left mb-4 col-span-2 max-sm:col-span-6">
                <FormLabel className="font-bold">Loại người dùng</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "all") {
                        field.onChange("");
                        return;
                      }
                      field.onChange(value);
                    }}
                  >
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

          <div className="flex flex-col col-span-6">
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
          isLoading={query.isFetching}
        />

        <CommonPagination
          data={query.data?.data}
          setSearchParam={setSearchParam}
          searchParam={searchParam}
        />
      </div>

      <AddUserModal
        open={open}
        setOpen={setOpen}
        provinceList={provinceQuery?.data?.data || []}
        refetch={query.refetch}
      />
    </>
  );
};

export default UserList;
